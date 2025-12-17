import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, Package, Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useTheme } from "next-themes";

interface NavbarProps {
  setShowLogin: (show: boolean) => void;
}

const Navbar = ({ setShowLogin }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { getTotalCartItems, user, signOut } = useStore();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const cartCount = getTotalCartItems();

  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/", section: null },
    { name: "Menu", path: "/#menu", section: "menu" },
    { name: "About", path: "/#about", section: "about" },
    { name: "Contact", path: "/#contact", section: "contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" && !location.hash;
    return location.hash === path.replace("/", "");
  };

  const handleNavClick = (e: React.MouseEvent, link: { path: string; section: string | null }) => {
    if (link.section) {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(link.section!);
          element?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.getElementById(link.section);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
              <span className="text-xl">🍔</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground">
              Quick<span className="text-primary">Bite</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Cart Button */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth Section */}
            {!user ? (
              <Button
                onClick={() => setShowLogin(true)}
                variant="default"
                size="sm"
                className="hidden sm:flex"
              >
                Sign In
              </Button>
            ) : (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="rounded-full"
                >
                  <User className="h-5 w-5" />
                </Button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-large border border-border overflow-hidden animate-scale-in">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/myorders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                    >
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">My Orders</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-primary"
                      >
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">Admin Panel</span>
                      </Link>
                    )}
                    <hr className="border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors w-full text-left text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-accent text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Button
                  onClick={() => {
                    setShowLogin(true);
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
