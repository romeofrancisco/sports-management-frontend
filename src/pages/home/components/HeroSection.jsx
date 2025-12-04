import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "/perpetual_logo_small.png";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-[600px] lg:min-h-[850px]"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:brightness-50"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dzebi1atl/image/upload/v1764843456/assets/MOLINO-Campus-Facade-2.2_w0hwsd.jpg')`,
        }}
      />

      {/* Dark Overlay - much darker in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50 dark:from-black/80 dark:via-black/70 dark:to-black/50" />

      {/* Content */}
      <div className="container mx-auto px-4 py-24 lg:py-40 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-muted backdrop-blur-sm px-4 py-2 rounded-full text-secondary dark:text-primary text-sm font-bold mb-6">
            <Trophy className="w-4 h-4" />
            UPHSD Molino Campus
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white dark:text-foreground mb-6 leading-tight">
            Sports{" "}
            <span className="text-secondary dark:text-primary">Management</span>{" "}
            System
          </h1>
          <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl">
            Empowering coaches, players, and administrators with a comprehensive
            platform to manage teams, track performance, and achieve athletic
            excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-secondary dark:bg-primary text-secondary-foreground dark:text-primary-foreground hover:bg-secondary/80 dark:hover:bg-primary/80 font-semibold px-8"
              asChild
            >
              <Link to="/login">
                Get Started
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/#about">
                Learn More <Info className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute -bottom-1 -left-5 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
