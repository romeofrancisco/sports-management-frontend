import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-4">
            Last updated: November 28, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to UPHSD Sports Management System. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Account information: name, email address, profile picture</li>
              <li>Authentication data when you sign in with Google</li>
              <li>Team and player information for sports management</li>
              <li>Documents and files you upload to the system</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.2 Information from Google Services</h3>
            <p className="text-muted-foreground mb-4">
              When you use Google Sign-In or connect Google Drive, we may access:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Your Google account email and profile information</li>
              <li>Google Drive files that you explicitly choose to open or create through our application</li>
              <li>Google Docs and Sheets that you edit within our system</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Authenticate and manage your account</li>
              <li>Provide sports management features (teams, schedules, statistics)</li>
              <li>Enable document editing and collaboration through Google Drive integration</li>
              <li>Send notifications about games, training sessions, and team updates</li>
              <li>Improve our services and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Google API Services User Data Policy</h2>
            <p className="text-muted-foreground mb-4">
              Our use and transfer of information received from Google APIs adheres to the{" "}
              <a 
                href="https://developers.google.com/terms/api-services-user-data-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
            <p className="text-muted-foreground mb-4">
              Specifically:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>We only request access to the Google services necessary for our application's functionality</li>
              <li>We do not use Google user data for advertising purposes</li>
              <li>We do not sell Google user data to third parties</li>
              <li>We only access, use, store, or share Google user data for the purposes described in this policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>With your consent</li>
              <li>With team members and coaches within your organization as necessary for sports management</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Secure HTTPS connections for all data transmission</li>
              <li>Encrypted storage of sensitive data</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Revoke Google API access at any time through your Google Account settings</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data by contacting your administrator.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-muted-foreground">
              Email: uphsdsportsmanager@gmail.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
