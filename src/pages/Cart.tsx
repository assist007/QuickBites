import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, foodList, removeFromCart, getTotalCartAmount, addToCart } = useStore();
  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  const cartItemsList = foodList.filter((item) => cartItems[item.id] > 0);

  if (cartItemsList.length === 0) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link to="/">
            <Button variant="hero">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Menu
            </Button>
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
          Continue Shopping
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">Your Cart</h1>
        <p className="text-muted-foreground mt-1">
          {cartItemsList.length} {cartItemsList.length === 1 ? "item" : "items"} in cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted rounded-xl text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Item</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* Items */}
          {cartItemsList.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-card rounded-xl border border-border shadow-soft animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Item info */}
              <div className="md:col-span-5 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                <span className="md:hidden text-sm text-muted-foreground">Price:</span>
                <span className="font-medium">৳{item.price}</span>
              </div>

              {/* Quantity */}
              <div className="md:col-span-3 flex items-center justify-between md:justify-center gap-2">
                <span className="md:hidden text-sm text-muted-foreground">Qty:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFromCart(item.id)}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">{cartItems[item.id]}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => addToCart(item.id)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Total & Remove */}
              <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                <span className="md:hidden text-sm text-muted-foreground">Total:</span>
                <span className="font-bold text-primary">
                  ৳{item.price * cartItems[item.id]}
                </span>
                <button
                  onClick={() => {
                    // Remove all of this item
                    for (let i = 0; i < cartItems[item.id]; i++) {
                      removeFromCart(item.id);
                    }
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card rounded-2xl border border-border shadow-card p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium">৳{deliveryFee}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-primary">৳{total}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button variant="secondary" size="sm">
                  Apply
                </Button>
              </div>
            </div>

            <Button
              variant="hero"
              className="w-full"
              size="lg"
              onClick={() => navigate("/order")}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
