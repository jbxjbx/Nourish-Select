'use client';

import { LoginForm } from './login-form';
import { OrganicBlobs, FloatingParticles } from '@/components/ui/FloatingParticles';
import { Leaf, Sparkles } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50">
            {/* Organic background */}
            <OrganicBlobs className="opacity-40" />
            <FloatingParticles count={10} />

            {/* Floating decorative elements */}
            <div className="absolute top-20 left-10 animate-float z-10">
                <Leaf className="w-8 h-8 text-emerald-500/20" />
            </div>
            <div className="absolute bottom-40 right-10 animate-float z-10" style={{ animationDelay: '2s' }}>
                <Sparkles className="w-6 h-6 text-amber-400/20" />
            </div>
            <div className="absolute top-1/2 left-5 animate-float z-10" style={{ animationDelay: '1s' }}>
                <Leaf className="w-6 h-6 text-emerald-400/15 rotate-45" />
            </div>

            <div className="container mx-auto py-16 relative z-20">
                <LoginForm />
            </div>
        </div>
    );
}
