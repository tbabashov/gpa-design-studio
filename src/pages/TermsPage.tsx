import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Terms of Service | EasyGPA</title>
        <meta name="description" content="Read EasyGPA's Terms of Service to understand your rights and responsibilities when using our GPA calculator." />
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

            <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 22, 2025</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using EasyGPA ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Service.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  EasyGPA provides a Grade Point Average (GPA) calculation tool designed to help students track and manage their academic performance. The Service includes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>GPA calculation for individual courses and semesters</li>
                  <li>Cumulative GPA tracking across multiple semesters</li>
                  <li>What-if scenario planning for future grades</li>
                  <li>GPA goal setting and tracking features</li>
                  <li>Data export and sharing capabilities</li>
                </ul>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To access certain features of the Service, you must create an account. When creating an account, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others</li>
                  <li>Transmit harmful code or malware</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Use the Service for any fraudulent purpose</li>
                </ul>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service and its original content, features, and functionality are owned by EasyGPA and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service without prior written consent.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. User Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You retain all rights to the data you input into the Service. We claim no ownership over your academic data, grades, or any other personal information you provide. Please refer to our Privacy Policy for information on how we collect, use, and protect your data.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure. GPA calculations are provided for informational purposes only and should be verified with your educational institution.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, EasyGPA shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from your use of or inability to use the Service.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately. You may also delete your account at any time through the account settings.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
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

export default TermsPage;