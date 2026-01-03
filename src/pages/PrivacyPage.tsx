import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Privacy Policy | EasyGPA</title>
        <meta name="description" content="Learn how EasyGPA collects, uses, and protects your personal information and academic data." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-8 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 22, 2025</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At EasyGPA, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our GPA calculation service. Please read this policy carefully to understand our practices regarding your personal data.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you create an account, we may collect:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Email address</li>
                  <li>Display name (optional)</li>
                  <li>Profile picture (optional)</li>
                  <li>Authentication data from third-party providers (Google, Microsoft)</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Academic Data</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To provide our GPA calculation services, we collect:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Course names and credit hours</li>
                  <li>Assignment names, grades, and weights</li>
                  <li>Semester information</li>
                  <li>GPA calculations and history</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Usage Data</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We automatically collect certain information when you use the Service:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Device and browser information</li>
                  <li>IP address</li>
                  <li>Pages visited and features used</li>
                  <li>Time and date of access</li>
                </ul>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>To provide and maintain the GPA calculation service</li>
                  <li>To create and manage your account</li>
                  <li>To save and sync your data across devices</li>
                  <li>To send important notifications about the Service</li>
                  <li>To respond to your inquiries and support requests</li>
                  <li>To improve and optimize the Service</li>
                  <li>To detect and prevent fraud or abuse</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Storage and Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal data:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>All data is encrypted in transit using TLS/SSL</li>
                  <li>Data at rest is encrypted using industry-standard encryption</li>
                  <li>Access to personal data is restricted to authorized personnel only</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Secure authentication with password hashing</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Your data is stored on secure servers. While we strive to protect your personal information, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Sharing and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your data only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> With trusted third-party services that help us operate the Service (e.g., hosting, analytics)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your data</li>
                </ul>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Export:</strong> Download your data in a portable format</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Objection:</strong> Object to certain types of processing</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, please contact us at the email address below or use the account settings in the application.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use essential cookies to maintain your session and preferences. We may also use analytics cookies to understand how users interact with the Service. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service is intended for users who are at least 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal data for as long as your account is active or as needed to provide the Service. If you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="text-primary mt-2">tbabashov6@outlook.com</p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;