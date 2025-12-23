import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, Clock, MapPin, Send, Github, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactPageProps {
  onNavigate: (section: string) => void;
}

const ContactPage = ({ onNavigate }: ContactPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData,
      });

      if (error) throw error;

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'tbabashov6@outlook.com',
      href: 'mailto:tbabashov6@outlook.com',
      color: 'primary',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri from 9am to 6pm',
      value: '+994 70 730 00 06',
      href: 'tel:+994707300006',
      color: 'secondary',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      description: 'When we\'re available',
      value: 'Mon-Fri: 9AM - 6PM EST',
      href: '#',
      color: 'tertiary',
    },
    {
      icon: MapPin,
      title: 'Location',
      description: 'Where we\'re based',
      value: 'Baku, Azerbaijan',
      href: '#',
      color: 'primary',
    },
  ];

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: '#', color: 'text-primary hover:bg-primary/20' },
    { icon: Github, label: 'GitHub', href: '#', color: 'text-secondary hover:bg-secondary/20' },
    { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'text-tertiary hover:bg-tertiary/20' },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'secondary': return 'text-secondary';
      case 'tertiary': return 'text-tertiary';
      default: return 'text-primary';
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | EasyGPA - Get in Touch</title>
        <meta name="description" content="Have questions about EasyGPA? Get in touch with our team. We're here to help you succeed academically." />
      </Helmet>

      <div className="min-h-screen">
        <Navbar onNavigate={onNavigate} />

        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Get in{' '}
                <span className="gradient-text aurora-glow">Touch</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.title}
                  href={method.href}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl glass-card hover:border-border transition-all duration-300 group"
                >
                  <method.icon className={`w-8 h-8 mb-4 ${getColorClass(method.color)} group-hover:scale-110 transition-transform`} />
                  <h3 className="font-display font-semibold mb-1">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                  <p className="text-foreground font-medium">{method.value}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Tell us more about your question..."
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="p-6 sm:p-8 rounded-2xl glass-card overflow-hidden">
                  <h3 className="text-xl font-display font-bold mb-4">Why EasyGPA?</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 break-words">
                    We built EasyGPA because we believe every student deserves a simple, beautiful tool to track their academic progress. Sign in to sync across devices or use it locally — your choice.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-muted-foreground">100% Free, forever</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                      <span className="text-muted-foreground">Sign in with Google or Microsoft</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-tertiary mt-2 shrink-0" />
                      <span className="text-muted-foreground">Your data is encrypted & secure</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 rounded-2xl glass-card">
                  <h3 className="text-xl font-display font-bold mb-4">Follow Us</h3>
                  <p className="text-muted-foreground mb-6">
                    Stay updated with the latest features and tips.
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center ${social.color} transition-all duration-300 hover:-translate-y-1`}
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="p-6 sm:p-8 rounded-2xl glass-card">
                  <h3 className="text-xl font-display font-bold mb-4">Newsletter</h3>
                  <p className="text-muted-foreground mb-4">
                    Get tips on improving your academic performance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <Button variant="hero" className="shrink-0">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer onNavigate={onNavigate} />
      </div>
    </>
  );
};

export default ContactPage;