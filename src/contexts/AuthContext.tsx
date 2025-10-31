// File: src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

// Define the shape of our Auth Context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: any }>;
  verifyOTP: (email: string, otp: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithEmail: async () => ({ error: null }),
  verifyOTP: async () => ({ error: null }),
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component that wraps your app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session when app loads
  useEffect(() => {
    checkSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth event:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Handle different auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', currentSession?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Check if there's an active session
  const checkSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error.message);
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    } catch (error) {
      console.error('Error in checkSession:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send OTP to email (for both signup and login)
  const signInWithEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true, // Create user if they don't exist
          emailRedirectTo: undefined, // Disable magic link redirect
        },
      });

      if (error) {
        console.error('Error sending OTP:', error.message);
        return { error };
      }

      console.log('OTP sent successfully to:', email);
      return { error: null };
    } catch (error) {
      console.error('Exception in signInWithEmail:', error);
      return { error };
    }
  };

  // Verify the OTP code
  const verifyOTP = async (email: string, otp: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email',
      });

      if (error) {
        console.error('Error verifying OTP:', error.message);
        return { error };
      }

      console.log('OTP verified successfully');
      
      // Check if this is a new user (profile doesn't exist yet)
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        // If no profile exists, create one
        if (!profile) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
          });
          console.log('New profile created');
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Exception in verifyOTP:', error);
      return { error };
    }
  };

  // Google Sign-In (we'll implement this in the next step)
// Replace the signInWithGoogle function with this improved version:
const signInWithGoogle = async () => {
  try {
    // Get the OAuth URL from Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'exp://192.168.0.112:8081', // Replace with your computer's actual IP
        skipBrowserRedirect: true, // We'll handle the browser ourselves
      },
    });

    if (error) {
      console.error('Error getting Google OAuth URL:', error.message);
      Alert.alert('Error', 'Failed to initiate Google Sign-In. Please try again.');
      return;
    }

    if (!data.url) {
      Alert.alert('Error', 'Could not get Google Sign-In URL.');
      return;
    }

    // Open the OAuth URL in a browser
    console.log('Opening Google Sign-In...');
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      'exp://localhost:8081'
    );

    if (result.type === 'success' && result.url) {
      // Extract the tokens from the URL
      const url = new URL(result.url);
      const accessToken = url.searchParams.get('access_token');
      const refreshToken = url.searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        // Set the session with the tokens
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('Error setting session:', sessionError.message);
          Alert.alert('Error', 'Failed to complete sign-in.');
          return;
        }

        // Check if profile exists, create if not
        if (sessionData.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', sessionData.user.id)
            .single();

          if (!profile) {
            await supabase.from('profiles').insert({
              id: sessionData.user.id,
              email: sessionData.user.email,
            });
            console.log('New profile created for Google user');
          }
        }

        console.log('Google Sign-In successful!');
      }
    } else if (result.type === 'cancel') {
      console.log('Google Sign-In cancelled by user');
    }
  } catch (error) {
    console.error('Exception in signInWithGoogle:', error);
    Alert.alert('Error', 'An unexpected error occurred during Google Sign-In.');
  }
};

  // Sign out the user
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error.message);
        Alert.alert('Error', 'Failed to sign out. Please try again.');
        return;
      }

      console.log('User signed out successfully');
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Exception in signOut:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  // Value object that will be provided to consumers
  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    verifyOTP,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};