'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { AuthSuccessToast } from '@/components/auth/AuthSuccessToast';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    showSuccessToast: (message: string, shouldRedirect?: boolean) => void;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [shouldRedirectAfterToast, setShouldRedirectAfterToast] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            setIsLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();

        // Listen for auth state changes - BUT don't show toast here
        // Toast is only shown when explicitly called from login form
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null);
                setIsLoading(false);

                // Only handle sign out redirect here
                if (event === 'SIGNED_OUT') {
                    router.push('/');
                    router.refresh();
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    // Called explicitly from login form after successful login
    const showSuccessToast = useCallback((message: string, shouldRedirect: boolean = true) => {
        setToastMessage(message);
        setShouldRedirectAfterToast(shouldRedirect);
        setToastVisible(true);

        if (shouldRedirect) {
            setTimeout(() => {
                router.push('/');
                router.refresh();
            }, 1500);
        }
    }, [router]);

    const signOut = useCallback(async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setUser(null);
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
