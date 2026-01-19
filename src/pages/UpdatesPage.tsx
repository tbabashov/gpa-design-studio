import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ArrowLeft, Check, CheckCheck, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Update {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const UpdatesPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUpdates();
    }
  }, [user]);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('user_updates')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoadingUpdates(false);
    }
  };

  const markAsRead = async (updateId: string) => {
    try {
      const { error } = await supabase
        .from('user_updates')
        .update({ read: true })
        .eq('id', updateId);

      if (error) throw error;
      setUpdates(prev => 
        prev.map(u => u.id === updateId ? { ...u, read: true } : u)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = updates.filter(u => !u.read).map(u => u.id);
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('user_updates')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) throw error;
      setUpdates(prev => prev.map(u => ({ ...u, read: true })));
      toast({
        title: "All caught up!",
        description: "All updates have been marked as read.",
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNavigate = (section: string) => {
    if (section === 'home') navigate('/');
    else if (section === 'calculator') navigate('/calculator');
    else if (section === 'features') navigate('/features');
    else if (section === 'contact') navigate('/contact');
  };

  const unreadCount = updates.filter(u => !u.read).length;

  if (loading || loadingUpdates) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={handleNavigate} />
      
      <main className="container mx-auto px-6 pt-24 pb-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Bell className="w-8 h-8" />
              Updates
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-sm rounded-full px-2.5 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </h1>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </Button>
            )}
          </div>

          {updates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No updates yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You'll see important announcements here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {updates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`transition-all cursor-pointer hover:shadow-md ${
                        !update.read 
                          ? 'border-primary/50 bg-primary/5' 
                          : 'hover:border-border/80'
                      }`}
                      onClick={() => !update.read && markAsRead(update.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {!update.read && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                            <CardTitle className="text-lg">{update.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {update.message}
                        </p>
                        {!update.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-3 gap-1 text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(update.id);
                            }}
                          >
                            <Check className="w-4 h-4" />
                            Mark as read
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default UpdatesPage;
