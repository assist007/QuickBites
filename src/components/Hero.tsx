import { ArrowRight, Clock, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/50 via-background to-background" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-warning/10 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <span className="animate-bounce-gentle">🎉</span>
              <span className="text-sm font-medium text-accent-foreground">
                Free delivery on first order!
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Order Your{" "}
              <span className="text-primary relative">
                Favourite
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary/30"
                  />
                </svg>
              </span>{" "}
              Food Here
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Choose from a diverse menu featuring a delectable array of dishes
              crafted with the finest ingredients. Satisfaction guaranteed!
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" onClick={scrollToMenu}>
                View Menu
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={scrollToHowItWorks}>
                How it works
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Star className="h-6 w-6 text-warning" fill="currentColor" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">25min</p>
                  <p className="text-sm text-muted-foreground">Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Truck className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Free</p>
                  <p className="text-sm text-muted-foreground">Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Main image container */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-large">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                  alt="Delicious food spread"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-4 md:-left-8 top-1/4 bg-card p-4 rounded-2xl shadow-large border border-border animate-bounce-gentle z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80"
                      alt="Burger"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Chicken Burger</p>
                    <p className="text-primary font-bold">৳280</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-4 md:-right-8 bottom-1/4 bg-card p-4 rounded-2xl shadow-large border border-border animate-bounce-gentle z-20"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-muted border-2 border-card overflow-hidden"
                      >
                        <img
                          src={`https://randomuser.me/api/portraits/women/${i + 20}.jpg`}
                          alt="Customer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pl-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning" fill="currentColor" />
                      <span className="font-bold">4.9</span>
                    </div>
                    <p className="text-xs text-muted-foreground">2k+ reviews</p>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -z-10 top-8 right-8 w-full h-full rounded-3xl bg-primary/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
