'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/context/language-context';

interface Address {
    id: string;
    type: 'shipping' | 'billing';
    label: string | null;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
}

const emptyAddress: Omit<Address, 'id'> = {
    type: 'shipping',
    label: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    is_default: false,
};

export default function AddressesPage() {
    const supabase = createClient();
    const { t } = useLanguage();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<Omit<Address, 'id'>>(emptyAddress);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .order('is_default', { ascending: false });

        if (data) setAddresses(data);
        setLoading(false);
    };

    const openAddDialog = (type: 'shipping' | 'billing') => {
        setEditingAddress(null);
        setFormData({ ...emptyAddress, type });
        setDialogOpen(true);
    };

    const openEditDialog = (address: Address) => {
        setEditingAddress(address);
        setFormData({
            type: address.type,
            label: address.label || '',
            line1: address.line1,
            line2: address.line2 || '',
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
            is_default: address.is_default,
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            if (editingAddress) {
                // Update
                const { error } = await supabase
                    .from('addresses')
                    .update(formData)
                    .eq('id', editingAddress.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('addresses')
                    .insert({ ...formData, user_id: user.id });
                if (error) throw error;
            }

            // If setting as default, unset others of same type
            if (formData.is_default) {
                await supabase
                    .from('addresses')
                    .update({ is_default: false })
                    .eq('type', formData.type)
                    .neq('id', editingAddress?.id || '');
            }

            setDialogOpen(false);
            fetchAddresses();
            setMessage({ type: 'success', text: 'Address saved successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const { error } = await supabase
                .from('addresses')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchAddresses();
            setMessage({ type: 'success', text: 'Address deleted' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const shippingAddresses = addresses.filter(a => a.type === 'shipping');
    const billingAddresses = addresses.filter(a => a.type === 'billing');

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
                <h1 className="text-2xl font-semibold text-stone-800">{t('account.addresses')}</h1>
                <p className="text-stone-500 mt-1">{t('account.addresses_desc')}</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Shipping Addresses */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {t('account.shipping_addresses')}
                    </CardTitle>
                    <Button size="sm" onClick={() => openAddDialog('shipping')}>
                        <Plus className="w-4 h-4 mr-1" /> {t('account.add_address')}
                    </Button>
                </CardHeader>
                <CardContent>
                    {shippingAddresses.length === 0 ? (
                        <p className="text-stone-400 text-sm py-4">{t('account.no_addresses')}</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {shippingAddresses.map((addr) => (
                                <AddressCard key={addr.id} address={addr} onEdit={openEditDialog} onDelete={handleDelete} t={t} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Billing Addresses */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {t('account.billing_addresses')}
                    </CardTitle>
                    <Button size="sm" onClick={() => openAddDialog('billing')}>
                        <Plus className="w-4 h-4 mr-1" /> {t('account.add_address')}
                    </Button>
                </CardHeader>
                <CardContent>
                    {billingAddresses.length === 0 ? (
                        <p className="text-stone-400 text-sm py-4">{t('account.no_addresses')}</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {billingAddresses.map((addr) => (
                                <AddressCard key={addr.id} address={addr} onEdit={openEditDialog} onDelete={handleDelete} t={t} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? t('account.edit_address') : t('account.add_address')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{t('account.address_label')}</Label>
                            <Input
                                placeholder="Home, Office, etc."
                                value={formData.label || ''}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('account.address_line1')} *</Label>
                            <Input
                                placeholder="Street address"
                                value={formData.line1}
                                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('account.address_line2')}</Label>
                            <Input
                                placeholder="Apt, suite, etc."
                                value={formData.line2 || ''}
                                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('account.city')} *</Label>
                                <Input
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('account.state')} *</Label>
                                <Input
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('account.postal_code')} *</Label>
                                <Input
                                    value={formData.postal_code}
                                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('account.country')} *</Label>
                                <Input
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_default}
                                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                className="rounded border-stone-300"
                            />
                            <span className="text-sm text-stone-600">{t('account.set_default')}</span>
                        </label>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                            {t('account.cancel')}
                        </Button>
                        <Button onClick={handleSave} disabled={saving || !formData.line1 || !formData.city}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {t('account.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function AddressCard({ address, onEdit, onDelete, t }: { address: Address; onEdit: (a: Address) => void; onDelete: (id: string) => void; t: (key: string) => string }) {
    return (
        <div className="border border-stone-200 rounded-lg p-4 relative">
            {address.is_default && (
                <Badge className="absolute top-2 right-2 bg-primary/10 text-primary border-0">
                    <Check className="w-3 h-3 mr-1" /> {t('account.default')}
                </Badge>
            )}
            {address.label && <p className="font-medium text-stone-800 mb-1">{address.label}</p>}
            <p className="text-sm text-stone-600">{address.line1}</p>
            {address.line2 && <p className="text-sm text-stone-600">{address.line2}</p>}
            <p className="text-sm text-stone-600">
                {address.city}, {address.state} {address.postal_code}
            </p>
            <p className="text-sm text-stone-600">{address.country}</p>
            <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => onEdit(address)}>
                    <Pencil className="w-3 h-3 mr-1" /> {t('account.edit')}
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete(address.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> {t('account.delete')}
                </Button>
            </div>
        </div>
    );
}
