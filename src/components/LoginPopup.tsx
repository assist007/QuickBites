import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginPopupProps {
  setShowLogin: (show: boolean) => void;
}

const LoginPopup = ({ setShowLogin }: LoginPopupProps) => {
  const [currState, setCurrState] = useState<"Login" | "Sign Up">("Login");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (currState === "Sign Up") {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: data.name,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try logging in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Account created!",
          description: "Welcome to QuickBite!",
        });
        setShowLogin(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You're now signed in to QuickBite.",
        });
        setShowLogin(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={() => setShowLogin(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-large p-6 md:p-8 animate-scale-in">
        {/* Close button */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
            <span className="text-3xl">🍔</span>
          </div>
          <h2 className="text-2xl font-bold">{currState}</h2>
          <p className="text-muted-foreground mt-1">
            {currState === "Login"
              ? "Welcome back to QuickBite!"
              : "Create your QuickBite account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {currState === "Sign Up" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                name="name"
                placeholder="Your name"
                value={data.name}
                onChange={onChangeHandler}
                className="pl-10 h-12"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={data.email}
              onChange={onChangeHandler}
              className="pl-10 h-12"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={data.password}
              onChange={onChangeHandler}
              className="pl-10 h-12"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Please wait..." : currState === "Login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {/* Terms */}
        {currState === "Sign Up" && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        )}

        {/* Toggle */}
        <div className="text-center mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {currState === "Login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setCurrState("Sign Up")}
                  className="text-primary font-semibold hover:underline"
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setCurrState("Login")}
                  className="text-primary font-semibold hover:underline"
                  disabled={isLoading}
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
