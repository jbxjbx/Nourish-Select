'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, XCircle, Loader2, RefreshCw, Eye, Shield, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/utils/supabase/client';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    is_subscription?: boolean;
}

interface Order {
    id: string;
    user_id: string;
    stripe_session_id: string | null;
    status: string;
    total_amount: number;
    currency: string;
    items: OrderItem[];
    tracking_number: string | null;
    customer_email: string | null;
    order_type: string | null;
    shipping_address: any;
    created_at: string;
    updated_at: string;
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock, label: 'Pending' },
    paid: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: CheckCircle, label: 'Paid' },
    processing: { color: 'bg-purple-100 text-purple-700 border-purple-300', icon: Package, label: 'Processing' },
    shipped: { color: 'bg-indigo-100 text-indigo-700 border-indigo-300', icon: Truck, label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, label: 'Delivered' },
    refund_requested: { color: 'bg-orange-100 text-orange-700 border-orange-300', icon: RefreshCw, label: 'Refund Requested' },
    refunded: { color: 'bg-stone-100 text-stone-700 border-stone-300', icon: XCircle, label: 'Refunded' },
    cancelled: { color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle, label: 'Cancelled' },
};

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'refund_requested', 'refunded', 'cancelled'];

export default function AdminOrdersPage() {
    const supabase = createClient();
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [trackingInput, setTrackingInput] = useState('');

    useEffect(() => {
        checkAdminAndFetch();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchQuery, statusFilter]);

    const checkAdminAndFetch = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            router.push('/');
            return;
        }

        setIsAdmin(true);
        await fetchOrders();
    };

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const filterOrders = () => {
        let filtered = orders;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(query) ||
                order.customer_email?.toLowerCase().includes(query) ||
                order.items.some(item => item.name.toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        setUpdating(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', orderId);

            if (error) throw error;

            setMessage({ type: 'success', text: `Order status updated to ${newStatus}` });
            await fetchOrders();

            // Update selected order if open
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUpdating(false);
        }
    };

    const updateTrackingNumber = async (orderId: string) => {
        if (!trackingInput.trim()) return;

        setUpdating(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    tracking_number: trackingInput.trim(),
                    status: 'shipped',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Tracking number added and order marked as shipped' });
            setTrackingInput('');
            await fetchOrders();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount);
    };

    const getRefundRequestCount = () => orders.filter(o => o.status === 'refund_requested').length;

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Admin Header */}
            <div className="bg-black text-white py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-primary" />
                        <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/')}>
                        Back to Store
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-500">Total Orders</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                        </CardContent>
                    </Card>
                    <Card className={getRefundRequestCount() > 0 ? 'border-orange-300 bg-orange-50' : ''}>
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-500">Refund Requests</p>
                            <p className="text-2xl font-bold text-orange-600">{getRefundRequestCount()}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-500">Processing</p>
                            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'processing').length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-500">Delivered</p>
                            <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
                        </CardContent>
                    </Card>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <Input
                            placeholder="Search by order ID, email, or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-48">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {statusOptions.map(status => (
                                <SelectItem key={status} value={status}>
                                    {statusConfig[status]?.label || status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={fetchOrders} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                </div>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-12 text-stone-500">
                                <Package className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                                <p>No orders found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="pb-3 font-medium">Order ID</th>
                                            <th className="pb-3 font-medium">Date</th>
                                            <th className="pb-3 font-medium">Customer</th>
                                            <th className="pb-3 font-medium">Items</th>
                                            <th className="pb-3 font-medium">Total</th>
                                            <th className="pb-3 font-medium">Type</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => {
                                            const status = statusConfig[order.status] || statusConfig.pending;
                                            const StatusIcon = status.icon;

                                            return (
                                                <tr key={order.id} className={`border-b hover:bg-stone-50 ${order.status === 'refund_requested' ? 'bg-orange-50' : ''}`}>
                                                    <td className="py-3 font-mono text-xs">
                                                        #{order.id.slice(0, 8).toUpperCase()}
                                                    </td>
                                                    <td className="py-3 text-stone-600">
                                                        {formatDate(order.created_at)}
                                                    </td>
                                                    <td className="py-3">
                                                        <p className="font-medium">{order.customer_email || 'N/A'}</p>
                                                    </td>
                                                    <td className="py-3">
                                                        <p className="text-stone-600">
                                                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                        </p>
                                                    </td>
                                                    <td className="py-3 font-medium">
                                                        {formatCurrency(order.total_amount, order.currency)}
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge variant="outline" className="text-xs">
                                                            {order.order_type || 'payment'}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge className={`${status.color} border text-xs`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {status.label}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setDetailsOpen(true);
                                                                }}
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                            </Button>
                                                            {order.status === 'refund_requested' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                        onClick={() => updateOrderStatus(order.id, 'refunded')}
                                                                        disabled={updating}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => updateOrderStatus(order.id, 'paid')}
                                                                        disabled={updating}
                                                                    >
                                                                        Deny
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            #{selectedOrder?.id.slice(0, 8).toUpperCase()}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6 py-4">
                            {/* Status Update */}
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium">Update Status:</label>
                                <Select
                                    value={selectedOrder.status}
                                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                                    disabled={updating}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map(status => (
                                            <SelectItem key={status} value={status}>
                                                {statusConfig[status]?.label || status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tracking Number */}
                            <div className="flex items-center gap-4">
                                <Input
                                    placeholder="Add tracking number..."
                                    value={trackingInput}
                                    onChange={(e) => setTrackingInput(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={() => updateTrackingNumber(selectedOrder.id)} disabled={updating || !trackingInput.trim()}>
                                    Add & Ship
                                </Button>
                            </div>
                            {selectedOrder.tracking_number && (
                                <p className="text-sm text-stone-500">
                                    Current Tracking: <span className="font-mono">{selectedOrder.tracking_number}</span>
                                </p>
                            )}

                            <hr />

                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-stone-500">Customer Email</p>
                                    <p className="font-medium">{selectedOrder.customer_email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-stone-500">Order Date</p>
                                    <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-stone-500">Order Type</p>
                                    <p className="font-medium">{selectedOrder.order_type || 'payment'}</p>
                                </div>
                                <div>
                                    <p className="text-stone-500">Stripe Session</p>
                                    <p className="font-mono text-xs">{selectedOrder.stripe_session_id?.slice(0, 20) || 'N/A'}...</p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {selectedOrder.shipping_address && (
                                <div>
                                    <p className="text-stone-500 text-sm mb-2">Shipping Address</p>
                                    <div className="bg-stone-50 p-3 rounded-lg text-sm">
                                        <p className="font-medium">{selectedOrder.shipping_address.name}</p>
                                        <p>{selectedOrder.shipping_address.line1}</p>
                                        {selectedOrder.shipping_address.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
                                        <p>
                                            {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                                        </p>
                                        <p>{selectedOrder.shipping_address.country}</p>
                                    </div>
                                </div>
                            )}

                            <hr />

                            {/* Items */}
                            <div>
                                <p className="text-stone-500 text-sm mb-3">Order Items</p>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-stone-500">
                                                    Qty: {item.quantity}
                                                    {item.is_subscription && <span className="ml-2 text-primary">(Subscription)</span>}
                                                </p>
                                            </div>
                                            <p className="font-medium">{formatCurrency(item.price * item.quantity, selectedOrder.currency)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatCurrency(selectedOrder.total_amount, selectedOrder.currency)}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
