import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Shield, 
  Database, 
  Eye, 
  Lock, 
  Users, 
  Clock, 
  Mail, 
  FileText,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sections = [
  { id: "introduction", title: "Introduction", icon: FileText },
  { id: "information-collected", title: "Information We Collect", icon: Database },
  { id: "how-we-use", title: "How We Use Your Information", icon: Eye },
  { id: "google-api", title: "Google API Services", icon: Shield },
  { id: "data-sharing", title: "Data Sharing", icon: Users },
  { id: "data-security", title: "Data Security", icon: Lock },
  { id: "your-rights", title: "Your Rights", icon: FileText },
  { id: "data-retention", title: "Data Retention", icon: Clock },
  { id: "contact", title: "Contact Us", icon: Mail },
  { id: "changes", title: "Changes to Policy", icon: FileText },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary dark:bg-primary/70" />
        <div className="container mx-auto px-4 pb-12 md:pb-20 lg:pb-30 pt-10 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Shield className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
                Privacy Policy
              </h1>
              <p className="text-primary-foreground/60 mt-1">
                Last updated: November 28, 2025
              </p>
            </div>
          </div>
          <p className="text-primary-foreground md:max-w-lg lg:max-w-2xl text-sm lg:text-lg">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
        {/* Wave Divider */}
        <div className="absolute -bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile TOC Toggle */}
          <div className="lg:hidden">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Table of Contents
              </span>
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            
            {/* Mobile TOC Dropdown */}
            {isMobileMenuOpen && (
              <div className="mt-2 p-4 bg-muted rounded-lg border">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                          activeSection === section.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted-foreground/10"
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {section.title}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>

          {/* Desktop Sidebar TOC */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 p-6 bg-muted/50 rounded-xl border">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left group",
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{section.title}</span>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-transform",
                        activeSection === section.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                      )} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            <div className="space-y-12">
              {/* Section 1: Introduction */}
              <section id="introduction" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">1. Introduction</h2>
                </div>
                <div className="pl-12">
                  <p className="text-muted-foreground leading-relaxed">
                    Welcome to UPHSD Sports Management System. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                  </p>
                </div>
              </section>

              {/* Section 2: Information We Collect */}
              <section id="information-collected" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">2. Information We Collect</h2>
                </div>
                <div className="pl-12 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">2.1 Information You Provide</h3>
                    <ul className="space-y-2">
                      {[
                        "Account information: name, email address, profile picture",
                        "Authentication data when you sign in with Google",
                        "Team and player information for sports management",
                        "Documents and files you upload to the system"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">2.2 Information from Google Services</h3>
                    <p className="text-muted-foreground mb-3">
                      When you use Google Sign-In or connect Google Drive, we may access:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Your Google account email and profile information",
                        "Google Drive files that you explicitly choose to open or create through our application",
                        "Google Docs and Sheets that you edit within our system"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3: How We Use Your Information */}
              <section id="how-we-use" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
                </div>
                <div className="pl-12">
                  <p className="text-muted-foreground mb-4">We use the collected information to:</p>
                  <ul className="space-y-2">
                    {[
                      "Authenticate and manage your account",
                      "Provide sports management features (teams, schedules, statistics)",
                      "Enable document editing and collaboration through Google Drive integration",
                      "Send notifications about games, training sessions, and team updates",
                      "Improve our services and user experience"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 4: Google API Services */}
              <section id="google-api" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">4. Google API Services User Data Policy</h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground">
                    Our use and transfer of information received from Google APIs adheres to the{" "}
                    <a 
                      href="https://developers.google.com/terms/api-services-user-data-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary/80 transition-colors"
                    >
                      Google API Services User Data Policy
                    </a>
                    , including the Limited Use requirements.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <p className="font-medium mb-3">Specifically:</p>
                    <ul className="space-y-2">
                      {[
                        "We only request access to the Google services necessary for our application's functionality",
                        "We do not use Google user data for advertising purposes",
                        "We do not sell Google user data to third parties",
                        "We only access, use, store, or share Google user data for the purposes described in this policy"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5: Data Sharing */}
              <section id="data-sharing" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">5. Data Sharing and Disclosure</h2>
                </div>
                <div className="pl-12">
                  <p className="text-muted-foreground mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "With your consent",
                      "With team members and coaches within your organization as necessary for sports management",
                      "To comply with legal obligations",
                      "To protect our rights and prevent fraud"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 6: Data Security */}
              <section id="data-security" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">6. Data Security</h2>
                </div>
                <div className="pl-12">
                  <p className="text-muted-foreground mb-4">
                    We implement appropriate technical and organizational security measures to protect your personal information, including:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { title: "Secure Connections", desc: "HTTPS for all data transmission" },
                      { title: "Encrypted Storage", desc: "Sensitive data is encrypted" },
                      { title: "Security Audits", desc: "Regular security updates" },
                      { title: "Access Controls", desc: "Authentication requirements" }
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-medium mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 7: Your Rights */}
              <section id="your-rights" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">7. Your Rights</h2>
                </div>
                <div className="pl-12">
                  <p className="text-muted-foreground mb-4">You have the right to:</p>
                  <ul className="space-y-2">
                    {[
                      "Access your personal data",
                      "Correct inaccurate data",
                      "Request deletion of your data",
                      "Revoke Google API access at any time through your Google Account settings",
                      "Export your data"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 8: Data Retention */}
              <section id="data-retention" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">8. Data Retention</h2>
                </div>
                <div className="pl-12">
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data by contacting your administrator.
                  </p>
                </div>
              </section>

              {/* Section 9: Contact Us */}
              <section id="contact" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">9. Contact Us</h2>
                </div>
                <div className="pl-12">
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <a 
                    href="mailto:uphsdsportsmanager@gmail.com" 
                    className="inline-flex items-center gap-2 px-4 py-3 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    uphsdsportsmanager@gmail.com
                  </a>
                </div>
              </section>

              {/* Section 10: Changes to Policy */}
              <section id="changes" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">10. Changes to This Policy</h2>
                </div>
                <div className="pl-12">
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary dark:bg-primary/70 text-center py-12 mt-16">
        <p className="text-white/70 text-sm">
          © 2025 UPHSD Molino Campus Sports Management System. All rights reserved.
        </p>
        <div className="mt-3 text-sm text-white/70">
          <Link to="/privacy-policy" className="underline hover:text-white">
            Privacy Policy
          </Link>
          <span className="mx-2">|</span>
          <Link to="/terms" className="underline hover:text-white">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
