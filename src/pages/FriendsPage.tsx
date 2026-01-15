import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Check, X, ArrowLeft, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { useAchievements } from '@/hooks/useAchievements';

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
    user_id: string;
  };
}

interface Profile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

const FriendsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { unlockAchievement, hasAchievement } = useAchievements();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;
    setLoadingFriends(true);

    try {
      // Fetch all friendships where user is involved
      const { data: friendships, error } = await supabase
        .from('friends')
        .select('*')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

      if (error) throw error;

      // Get all unique user IDs we need profiles for
      const userIds = new Set<string>();
      friendships?.forEach(f => {
        userIds.add(f.user_id);
        userIds.add(f.friend_id);
      });
      userIds.delete(user.id);

      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', Array.from(userIds));

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));

      // Categorize friendships
      const accepted: Friend[] = [];
      const incoming: Friend[] = [];
      const outgoing: Friend[] = [];

      friendships?.forEach(f => {
        const otherUserId = f.user_id === user.id ? f.friend_id : f.user_id;
        const friendWithProfile = {
          ...f,
          profile: profileMap.get(otherUserId),
        };

        if (f.status === 'accepted') {
          accepted.push(friendWithProfile);
        } else if (f.friend_id === user.id) {
          incoming.push(friendWithProfile);
        } else {
          outgoing.push(friendWithProfile);
        }
      });

      setFriends(accepted);
      setPendingRequests(incoming);
      setSentRequests(outgoing);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() || !user) return;
    setSearching(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .ilike('display_name', `%${searchQuery}%`)
        .neq('user_id', user.id)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending',
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already sent",
            description: "You've already sent a friend request to this user.",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Request sent!",
        description: "Friend request sent successfully.",
      });

      setSearchResults(prev => prev.filter(p => p.user_id !== friendId));
      fetchFriends();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request.",
        variant: "destructive",
      });
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Friend added!",
        description: "You are now friends.",
      });

      await fetchFriends();
      
      // Check friend achievements
      const friendCount = friends.length + 1; // +1 for the new friend
      if (friendCount >= 1 && !hasAchievement('first_friend')) {
        await unlockAchievement('first_friend');
      }
      if (friendCount >= 3 && !hasAchievement('social_butterfly')) {
        await unlockAchievement('social_butterfly');
      }
      if (friendCount >= 5 && !hasAchievement('popular')) {
        await unlockAchievement('popular');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request.",
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Removed",
        description: "Friend removed from your list.",
      });

      fetchFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: "Error",
        description: "Failed to remove friend.",
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

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isAlreadyFriendOrRequested = (userId: string) => {
    return friends.some(f => f.profile?.user_id === userId) ||
           sentRequests.some(f => f.friend_id === userId) ||
           pendingRequests.some(f => f.user_id === userId);
  };

  if (loading || loadingFriends) {
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
      
      <main className="container mx-auto px-6 pt-24 pb-12 max-w-4xl">
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

          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Friends
          </h1>

          {/* Search Users */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add Friends
              </CardTitle>
              <CardDescription>Search for users by their display name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                />
                <Button onClick={searchUsers} disabled={searching}>
                  <Search className="w-4 h-4 mr-2" />
                  {searching ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map((profile) => (
                    <div
                      key={profile.user_id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={profile.avatar_url || undefined} />
                          <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{profile.display_name || 'Anonymous'}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => sendFriendRequest(profile.user_id)}
                        disabled={isAlreadyFriendOrRequested(profile.user_id)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        {isAlreadyFriendOrRequested(profile.user_id) ? 'Sent' : 'Add'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Friends Tabs */}
          <Tabs defaultValue="friends">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="friends">
                Friends ({friends.length})
              </TabsTrigger>
              <TabsTrigger value="requests" className="relative">
                Requests
                {pendingRequests.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent">
                Sent ({sentRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {friends.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No friends yet. Search for users to add them!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {friends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={friend.profile?.avatar_url || undefined} />
                              <AvatarFallback>{getInitials(friend.profile?.display_name || null)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{friend.profile?.display_name || 'Anonymous'}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFriend(friend.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {pendingRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No pending friend requests.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {pendingRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={request.profile?.avatar_url || undefined} />
                              <AvatarFallback>{getInitials(request.profile?.display_name || null)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{request.profile?.display_name || 'Anonymous'}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => acceptFriendRequest(request.id)}
                              className="gap-1"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFriend(request.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sent" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {sentRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No sent requests.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {sentRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={request.profile?.avatar_url || undefined} />
                              <AvatarFallback>{getInitials(request.profile?.display_name || null)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{request.profile?.display_name || 'Anonymous'}</span>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFriend(request.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            Cancel
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default FriendsPage;
