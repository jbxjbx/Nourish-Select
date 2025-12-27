'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/context/language-context';

interface Profile {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    avatar_url: string | null;
}

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    const { t } = useLanguage();

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Password change
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            // Fetch profile
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                setProfile(profile);
                setFirstName(profile.first_name || user.user_metadata?.first_name || '');
                setLastName(profile.last_name || user.user_metadata?.last_name || '');
                setPhone(profile.phone || '');
                setAvatarUrl(profile.avatar_url || '');
            } else {
                // Use metadata if no profile exists
                setFirstName(user.user_metadata?.first_name || '');
                setLastName(user.user_metadata?.last_name || '');
            }
            setLoading(false);
        };
        fetchProfile();
    }, [supabase, router]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploadingAvatar(true);
        setMessage(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: publicUrl,
                });

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: 'Avatar updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to upload avatar' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            // Update profile in database
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    avatar_url: avatarUrl,
                });

            if (profileError) throw profileError;

            // Update auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`,
                }
            });

            if (authError) throw authError;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordSection(false);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to change password' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-stone-800">{t('account.profile')}</h1>
                <p className="text-stone-500 mt-1">{t('account.profile_desc')}</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Avatar Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{t('account.avatar')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-semibold text-stone-400">
                                        {firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                                    </span>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                                <Camera className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                    disabled={uploadingAvatar}
                                />
                            </label>
                        </div>
                        <div>
                            <p className="text-sm text-stone-600">{t('account.avatar_hint')}</p>
                            {uploadingAvatar && (
                                <p className="text-sm text-primary flex items-center gap-2 mt-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{t('account.basic_info')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('account.first_name')}</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t('account.last_name')}</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('account.email')}</Label>
                        <Input
                            id="email"
                            value={user?.email || ''}
                            disabled
                            className="bg-stone-50"
                        />
                        <p className="text-xs text-stone-400">{t('account.email_readonly')}</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('account.phone')}</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={saving} className="mt-4">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {t('account.save_changes')}
                    </Button>
                </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{t('account.change_password')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {!showPasswordSection ? (
                        <Button variant="outline" onClick={() => setShowPasswordSection(true)}>
                            {t('account.change_password')}
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">{t('account.new_password')}</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">{t('account.confirm_password')}</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleChangePassword} disabled={saving}>
                                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {t('account.update_password')}
                                </Button>
                                <Button variant="ghost" onClick={() => setShowPasswordSection(false)}>
                                    {t('account.cancel')}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
