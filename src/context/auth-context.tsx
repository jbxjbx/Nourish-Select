'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { AuthSuccessToast } from '@/components/auth/AuthSuccessToast';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    showSuccessToast: (message: string) => void;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const router = useRouter();
    const supabase = createClient();

    // Track if we've already shown the welcome toast for current session
    const hasShownWelcomeToast = useRef(false);
    // Track if this is initial load (not a real login event)
    const isInitialLoad = useRef(true);

    // Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            setIsLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
                // If user already logged in on mount, don't show toast
                if (session?.user) {
                    hasShownWelcomeToast.current = true;
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setIsLoading(false);
                // Mark initial load as complete after a short delay
                setTimeout(() => {
                    isInitialLoad.current = false;
                }, 1000);
            }
        };
        checkSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, session: Session | null) => {
                const newUser = session?.user ?? null;
                setUser(newUser);
                setIsLoading(false);

                // Only show toast and redirect on actual login, not on page revisit
                if (event === 'SIGNED_IN' && newUser && !isInitialLoad.current && !hasShownWelcomeToast.current) {
                    hasShownWelcomeToast.current = true;
                    showSuccessToast(`Welcome, ${newUser.user_metadata?.first_name || 'User'}!`);
                    setTimeout(() => {
                        router.push('/');
                        router.refresh();
                    }, 1500);
                } else if (event === 'SIGNED_OUT') {
                    hasShownWelcomeToast.current = false;
                    router.push('/');
                    router.refresh();
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    const showSuccessToast = useCallback((message: string) => {
        setToastMessage(message);
        setToastVisible(true);
    }, []);

    const signOut = useCallback(async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        hasShownWelcomeToast.current = false;
        setIsLoading(false);
        router.push('/');
        router.refresh();
    }, [supabase, router]);

    return (
        <AuthContext.Provider value={{ user, isLoading, showSuccessToast, signOut }}>
            {children}
            <AuthSuccessToast
                isVisible={toastVisible}
                message={toastMessage}
                onClose={() => setToastVisible(false)}
                autoCloseMs={2000}
            />
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
