import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, Clock, CheckCircle, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  food_name: string;
  food_image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  delivered: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  out_for_delivery: {
    icon: Truck,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  preparing: {
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  confirmed: {
    icon: Clock,
    color: "text-info",
    bg: "bg-info/10",
  },
  pending: {
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  cancelled: {
    icon: Clock,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const MyOrders = () => {
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.id);
          return { ...order, order_items: items || [] };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Real-time subscription for order updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Order updated:', payload);
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === payload.new.id
                ? { ...order, status: payload.new.status }
                : order
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your orders.
          </p>
          <Link to="/">
            <Button variant="hero">Go to Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage your orders</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className="bg-card rounded-2xl border border-border shadow-card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">Order #{order.id.slice(0, 8)}</h3>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg}`}>
                        <StatusIcon className={`h-4 w-4 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">৳{order.total_amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_items.length} {order.order_items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                <hr className="border-border mb-4" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Items</p>
                    <p className="font-medium">
                      {order.order_items.map((item) => item.food_name).join(", ")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Your order history will appear here
          </p>
          <Link to="/">
            <Button variant="hero">Start Ordering</Button>
          </Link>
        </div>
      )}
    </main>
  );
};

export default MyOrders;
