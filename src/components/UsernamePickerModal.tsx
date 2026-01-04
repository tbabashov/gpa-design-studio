import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const UsernamePickerModal = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user needs to set username on first sign-in
  useEffect(() => {
    const checkUsername = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .maybeSingle();

        // If profile exists but has no display name, show the picker
        if (profile && !profile.display_name) {
          setIsOpen(true);
        } else if (!profile) {
          // Create profile if it doesn't exist, then show picker
          await supabase.from('profiles').insert({
            user_id: user.id,
            display_name: null,
          });
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error checking username:', error);
      }
    };

    checkUsername();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !username.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: username.trim() })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(`Welcome, ${username.trim()}!`);
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving username:', error);
      toast.error('Failed to save username');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!user) return;

    // Set a default name based on email or random
    const defaultName = user.email?.split('@')[0] || 'Student';
    
    try {
      await supabase
        .from('profiles')
        .update({ display_name: defaultName })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error setting default username:', error);
    }
    
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleSkip}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-elevated"
          >
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              
              {/* Title */}
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Welcome to EasyGPA!
              </h2>
              <p className="mb-6 text-muted-foreground">
                What should we call you?
              </p>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    autoFocus
                    maxLength={30}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleSkip}
                    disabled={isLoading}
                  >
                    Skip
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading || !username.trim()}
                  >
                    {isLoading ? 'Saving...' : 'Continue'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UsernamePickerModal;
