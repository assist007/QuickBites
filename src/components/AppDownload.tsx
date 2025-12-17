import { Smartphone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppDownload = () => {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-background/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-background/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
            {/* Content */}
            <div className="space-y-6 text-primary-foreground">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/20">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-medium">Mobile App</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Get the QuickBite App
              </h2>

              <p className="text-lg text-primary-foreground/80 max-w-md">
                For better experience, download our mobile app. Get exclusive offers
                and faster ordering.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  App Store
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  Play Store
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-sm text-primary-foreground/70">Downloads</p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-3xl font-bold">4.8</p>
                    <Star className="h-5 w-5" fill="currentColor" />
                  </div>
                  <p className="text-sm text-primary-foreground/70">App Rating</p>
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-foreground rounded-[3rem] p-3 shadow-large">
                  <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"
                      alt="App preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
