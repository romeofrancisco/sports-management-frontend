import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section
      className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 dark:from-primary/60 dark:via-primary/55 dark:to-primary/50 relative overflow-hidden"
      id="contact"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* CTA Content */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your{" "}
              <span className="text-secondary">Sports Program?</span>
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join UPHSD Molino's comprehensive sports management platform and
              take your athletic program to the next level.
            </p>

            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
              asChild
            >
              <Link to="/signup">
                Register Now
                <ChevronRight />
              </Link>
            </Button>
          </div>

          {/* Contact Info & Map */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Contact Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Address</p>
                    <p className="text-white/70 text-sm">
                      3 Molino Rd, Bacoor, Cavite, Philippines
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <a
                      href="mailto:sports@perpetualdalta.edu.ph"
                      className="text-white/70 text-sm hover:text-secondary transition-colors"
                    >
                      sports@perpetualdalta.edu.ph
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Phone className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <a
                      href="tel:+6324770691"
                      className="text-white/70 text-sm hover:text-secondary transition-colors"
                    >
                      (02) 477-0691
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.2076651267247!2d120.97501287573872!3d14.395552886309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d3cfd75b08eb%3A0xa40b1d5ad035c034!2sUniversity%20of%20Perpetual%20Help%20System%20DALTA%20%E2%80%93%20Molino%20Campus!5e0!3m2!1sen!2sph!4v1701680000000!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  minHeight: "250px",
                  borderRadius: "0.75rem",
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="UPHSD Molino Campus Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
