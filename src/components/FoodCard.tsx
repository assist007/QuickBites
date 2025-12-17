import { Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodItem, useStore } from "@/context/StoreContext";

interface FoodCardProps {
  item: FoodItem;
  index: number;
}

const FoodCard = ({ item, index }: FoodCardProps) => {
  const { cartItems, addToCart, removeFromCart } = useStore();
  const quantity = cartItems[item.id] || 0;

  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-large transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm">
          <Star className="h-3 w-3 text-warning" fill="currentColor" />
          <span className="text-xs font-semibold">{item.rating}</span>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 text-card-foreground group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {item.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            ৳{item.price}
          </p>

          {quantity === 0 ? (
            <Button
              onClick={() => addToCart(item.id)}
              size="sm"
              className="rounded-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => removeFromCart(item.id)}
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <Button
                onClick={() => addToCart(item.id)}
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
