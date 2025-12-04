import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  HeroSection,
  StatsSection,
  AboutSection,
  FeaturesSection,
  SportsSection,
  UserRolesSection,
  BenefitsSection,
  CTASection,
  Footer,
} from "./components";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Handle hash navigation when coming from another page
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
      <SportsSection />
      <UserRolesSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
