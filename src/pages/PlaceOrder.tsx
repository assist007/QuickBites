import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PlaceOrder = () => {
  const { getTotalCartAmount, clearCart, cartItems, foodList, user } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  const cartItemsList = foodList.filter((item) => cartItems[item.id] > 0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to place an order.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          delivery_address: formData.street,
          delivery_city: formData.city,
          delivery_state: formData.state,
          delivery_zip: formData.zipCode,
          phone: formData.phone,
          payment_method: paymentMethod,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItemsList.map((item) => ({
        order_id: order.id,
        food_id: item.id,
        food_name: item.name,
        food_image: item.image,
        quantity: cartItems[item.id],
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Your delicious food is on its way.",
      });
      navigate("/myorders");
    } catch (error: any) {
      toast({
        title: "Order failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (subtotal === 0) {
    navigate("/cart");
    return null;
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Please sign in to checkout</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to place an order.
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
          to="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Delivery Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info */}
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Delivery Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
                <Input
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
                <Input
                  name="street"
                  placeholder="Street address"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="h-12 sm:col-span-2"
                />
                <Input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                  <Input
                    name="zipCode"
                    placeholder="ZIP"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Payment Method</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred payment
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-border peer-checked:border-primary peer-checked:bg-accent transition-all">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive</p>
                    </div>
                  </div>
                </label>

                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-border peer-checked:border-primary peer-checked:bg-accent transition-all">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Card Payment</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl border border-border shadow-card p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItemsList.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        x{cartItems[item.id]}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      ৳{item.price * cartItems[item.id]}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-border mb-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">৳{deliveryFee}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-primary">৳{total}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Place Order • ৳${total}`}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default PlaceOrder;
