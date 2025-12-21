import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, TrendingUp, Award, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

interface GpaCalculation {
  id: string;
  gpa: number;
  semester_name: string | null;
  created_at: string;
}

const DashboardPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [calculations, setCalculations] = useState<GpaCalculation[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchCalculations();
    }
  }, [user]);

  const fetchCalculations = async () => {
    try {
      const { data, error } = await supabase
        .from('gpa_calculations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCalculations(data || []);
    } catch (error) {
      console.error('Error fetching calculations:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete user's calculations first
      await supabase.from('gpa_calculations').delete().eq('user_id', user?.id);
      
      // Delete profile
      await supabase.from('profiles').delete().eq('user_id', user?.id);
      
      // Sign out
      await signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account and all data have been removed.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavigate = (section: string) => {
    if (section === 'home') navigate('/');
    else if (section === 'calculator') navigate('/calculator');
    else if (section === 'features') navigate('/features');
    else if (section === 'contact') navigate('/contact');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const latestGpa = calculations.length > 0 ? calculations[0].gpa : null;
  const averageGpa = calculations.length > 0 
    ? (calculations.reduce((sum, calc) => sum + Number(calc.gpa), 0) / calculations.length).toFixed(2)
    : null;

  const chartData = [...calculations]
    .reverse()
    .slice(-10)
    .map((calc, index) => ({
      name: calc.semester_name || `Calc ${index + 1}`,
      gpa: Number(calc.gpa),
    }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={handleNavigate} />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>
          
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Latest Grade Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5" />
                  Latest Grade
                </CardTitle>
                <CardDescription>From your most recent calculation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {latestGpa !== null ? latestGpa.toFixed(2) : '-'}
                </p>
              </CardContent>
            </Card>

            {/* Average Grade Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5" />
                  Average Grade
                </CardTitle>
                <CardDescription>Overall average across all calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {averageGpa !== null ? averageGpa : '-'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Grade History Graph */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Grade History</CardTitle>
              <CardDescription>Your GPA trend over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="name" 
                        className="text-xs fill-muted-foreground"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        domain={[0, 4]} 
                        className="text-xs fill-muted-foreground"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gpa" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>No calculations yet. Start calculating to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Calculations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Calculations</CardTitle>
              <CardDescription>Your latest GPA calculations</CardDescription>
            </CardHeader>
            <CardContent>
              {calculations.length > 0 ? (
                <div className="space-y-3">
                  {calculations.slice(0, 5).map((calc) => (
                    <div 
                      key={calc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{calc.semester_name || 'Calculation'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(calc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-primary">{Number(calc.gpa).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No calculations yet. Use the calculator to get started!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/50 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data including GPA calculations and profile information.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
