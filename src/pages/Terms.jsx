import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ScrollText,
  FileText,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Scale,
  RefreshCw,
  Mail,
  ChevronRight,
  Menu,
  X,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", icon: FileText },
  { id: "description", title: "Service Description", icon: Globe },
  { id: "eligibility", title: "User Eligibility", icon: UserCheck },
  { id: "accounts", title: "User Accounts", icon: Users },
  { id: "acceptable-use", title: "Acceptable Use", icon: ShieldCheck },
  { id: "prohibited", title: "Prohibited Activities", icon: Ban },
  { id: "intellectual-property", title: "Intellectual Property", icon: Scale },
  { id: "disclaimer", title: "Disclaimer of Warranties", icon: AlertTriangle },
  { id: "limitation", title: "Limitation of Liability", icon: AlertTriangle },
  { id: "termination", title: "Termination", icon: Ban },
  { id: "changes", title: "Changes to Terms", icon: RefreshCw },
  { id: "contact", title: "Contact Us", icon: Mail },
];

const Terms = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) =>
        document.getElementById(s.id)
      );
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
      <section className="relative overflow-hidden bg-primary dark:bg-primary/70">
        <div className="absolute inset-0 bg-primary dark:bg-primary/70" />
        <div className="container mx-auto px-4 pb-12 md:pb-20 lg:pb-30 pt-10 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <ScrollText className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Terms of Service
              </h1>
              <p className="text-white/70 mt-1">
                Last updated: December 6, 2025
              </p>
            </div>
          </div>
          <p className="text-primary-foreground md:max-w-lg lg:max-w-2xl text-sm lg:text-lg">
            Please read these terms carefully before using the UPHSD Sports
            Management System.
          </p>
        </div>
        {/* Wave Divider */}
        <div className="absolute -bottom-0 left-0 right-0">
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
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
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
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform",
                          activeSection === section.id
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                        )}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            <div className="space-y-12">
              {/* Section 1: Acceptance of Terms */}
              <section id="acceptance" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing or using the UPHSD Sports Management System
                    ("the Service"), you agree to be bound by these Terms of
                    Service ("Terms"). If you do not agree to these Terms,
                    please do not use the Service.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms constitute a legally binding agreement between
                    you and the University of Perpetual Help System DALTA -
                    Molino Campus ("UPHSD," "we," "us," or "our") regarding your
                    use of the Service.
                  </p>
                </div>
              </section>

              {/* Section 2: Service Description */}
              <section id="description" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">2. Service Description</h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    The UPHSD Sports Management System is a comprehensive
                    platform designed to facilitate sports program management at
                    UPHSD Molino Campus. The Service provides:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Team and player roster management",
                      "Game scheduling and facility reservations",
                      "Tournament and league bracket management",
                      "Player statistics and performance tracking",
                      "Document management and collaboration via Google Drive integration",
                      "Real-time notifications and communication tools",
                      "Training session scheduling and attendance tracking",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 3: User Eligibility */}
              <section id="eligibility" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">3. User Eligibility</h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    The Service is intended for use by authorized members of
                    UPHSD Molino Campus, including:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Administrators and staff members responsible for sports program management",
                      "Coaches and assistant coaches of athletic teams",
                      "Student-athletes who are officially registered players",
                      "Other personnel authorized by UPHSD administration",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    You must be at least 13 years old to use the Service. If you
                    are under 18, you represent that your parent or guardian has
                    reviewed and agreed to these Terms.
                  </p>
                </div>
              </section>

              {/* Section 4: User Accounts */}
              <section id="accounts" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">4. User Accounts</h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    To access the Service, you must be a registered University
                    of Perpetual Help athlete and be approved by both a coach
                    and an administrator, or have an account assigned to you by
                    authorized coaching staff or system administrators.{" "}
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Provide accurate, current, and complete information during registration",
                      "Maintain and promptly update your account information",
                      "Keep your login credentials secure and confidential",
                      "Notify us immediately of any unauthorized access to your account",
                      "Accept responsibility for all activities that occur under your account",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Note:</strong> Account
                      access is managed by UPHSD administrators. Your account
                      may be assigned a specific role (Admin, Coach, or Player)
                      that determines your permissions within the system.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 5: Acceptable Use */}
              <section id="acceptable-use" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">5. Acceptable Use</h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to use the Service only for its intended purposes
                    related to UPHSD sports program management. Acceptable use
                    includes:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Managing team rosters, schedules, and player information",
                      "Recording and tracking game statistics and performance data",
                      "Communicating with team members about sports-related matters",
                      "Uploading and managing documents related to sports programs",
                      "Scheduling facilities and organizing training sessions",
                      "Participating in tournaments and league activities",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 6: Prohibited Activities */}
              <section id="prohibited" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <Ban className="w-5 h-5 text-destructive" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    6. Prohibited Activities
                  </h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    You agree NOT to engage in any of the following prohibited
                    activities:
                  </p>
                  <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/20">
                    <ul className="space-y-2">
                      {[
                        "Sharing your account credentials with unauthorized persons",
                        "Attempting to access accounts or data belonging to others",
                        "Uploading malicious software, viruses, or harmful content",
                        "Using the Service for any unlawful purpose",
                        "Harassing, threatening, or intimidating other users",
                        "Manipulating or falsifying sports statistics or records",
                        "Circumventing security measures or access controls",
                        "Using the Service for commercial purposes unrelated to UPHSD",
                        "Scraping, copying, or extracting data without authorization",
                        "Interfering with the proper functioning of the Service",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7: Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Scale className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    7. Intellectual Property
                  </h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    The Service and its original content, features, and
                    functionality are owned by UPHSD and are protected by
                    copyright, trademark, and other intellectual property laws.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You retain ownership of any content you upload to the
                    Service, but you grant UPHSD a non-exclusive license to use,
                    display, and process such content as necessary to provide
                    the Service.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    The UPHSD name, logo, and "Altas" branding are trademarks of
                    the University of Perpetual Help System DALTA and may not be
                    used without permission.
                  </p>
                </div>
              </section>

              {/* Section 8: Disclaimer of Warranties */}
              <section id="disclaimer" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    8. Disclaimer of Warranties
                  </h2>
                </div>
                <div className="pl-12 space-y-4">
                  <div className="bg-yellow-500/5 rounded-lg p-4 border border-yellow-500/20">
                    <p className="text-muted-foreground leading-relaxed">
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                      WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
                      INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                      NON-INFRINGEMENT.
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not warrant that:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "The Service will be uninterrupted, secure, or error-free",
                      "The results obtained from using the Service will be accurate",
                      "Any errors in the Service will be corrected",
                      "The Service will meet your specific requirements",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 9: Limitation of Liability */}
              <section id="limitation" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    9. Limitation of Liability
                  </h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    To the maximum extent permitted by law, UPHSD shall not be
                    liable for any indirect, incidental, special, consequential,
                    or punitive damages, including but not limited to:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Loss of data or information",
                      "Loss of revenue or profits",
                      "Business interruption",
                      "Personal injury or property damage",
                      "Any damages arising from unauthorized access to your account",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 10: Termination */}
              <section id="termination" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Ban className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">10. Termination</h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to suspend or terminate your access to
                    the Service at any time, with or without cause, and with or
                    without notice. Grounds for termination may include:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Violation of these Terms of Service",
                      "Conduct that we determine to be harmful to other users or UPHSD",
                      "Graduation, withdrawal, or end of affiliation with UPHSD",
                      "Extended period of inactivity",
                      "Request by you to close your account",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    Upon termination, your right to use the Service will
                    immediately cease. Any provisions of these Terms that by
                    their nature should survive termination shall survive.
                  </p>
                </div>
              </section>

              {/* Section 11: Changes to Terms */}
              <section id="changes" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">11. Changes to Terms</h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify or replace these Terms at any
                    time. If we make material changes, we will provide notice
                    through the Service or by other means.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Your continued use of the Service after any changes
                    constitutes your acceptance of the new Terms. If you do not
                    agree to the modified terms, you should discontinue use of
                    the Service.
                  </p>
                </div>
              </section>

              {/* Section 12: Contact Us */}
              <section id="contact" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">12. Contact Us</h2>
                </div>
                <div className="pl-12 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Service,
                    please contact us:
                  </p>
                  <a
                    href="mailto:uphsdsportsmanager@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-3 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    uphsdsportsmanager@gmail.com
                  </a>
                  <div className="bg-muted/50 rounded-lg p-4 border mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">
                        University of Perpetual Help System DALTA
                      </strong>
                      <br />
                      Molino Campus
                      <br />
                      Molino III, Bacoor, Cavite, Philippines
                    </p>
                  </div>
                </div>
              </section>

              {/* Acknowledgment */}
              <section className="scroll-mt-24 pt-8 border-t">
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                  <h3 className="font-semibold text-lg mb-2">Acknowledgment</h3>
                  <p className="text-muted-foreground">
                    By using the UPHSD Sports Management System, you acknowledge
                    that you have read, understood, and agree to be bound by
                    these Terms of Service and our{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-primary underline hover:text-primary/80"
                    >
                      Privacy Policy
                    </Link>
                    .
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
          © 2025 UPHSD Molino Campus Sports Management System. All rights
          reserved.
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
};

export default Terms;
