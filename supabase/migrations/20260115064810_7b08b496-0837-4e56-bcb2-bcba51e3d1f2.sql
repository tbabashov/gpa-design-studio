-- Create friends table for friend requests and friendships
CREATE TABLE public.friends (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    friend_id uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, friend_id)
);

-- Enable Row Level Security
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Users can view their own friend requests (sent or received)
CREATE POLICY "Users can view their own friendships"
ON public.friends
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can send friend requests
CREATE POLICY "Users can send friend requests"
ON public.friends
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update friend requests they received (accept)
CREATE POLICY "Users can accept friend requests"
ON public.friends
FOR UPDATE
USING (auth.uid() = friend_id);

-- Users can delete their own friendships
CREATE POLICY "Users can delete friendships"
ON public.friends
FOR DELETE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Create index for faster lookups
CREATE INDEX idx_friends_user_id ON public.friends(user_id);
CREATE INDEX idx_friends_friend_id ON public.friends(friend_id);

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add policy for profiles to allow viewing other users' display names for friend search
CREATE POLICY "Users can view all profiles for friend search"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;