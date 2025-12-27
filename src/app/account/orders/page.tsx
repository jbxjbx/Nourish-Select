'use client';

import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle, Loader2, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/context/language-context';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface Order {
    id: string;
    stripe_session_id: string | null;
    status: string;
    total_amount: number;
    currency: string;
    items: OrderItem[];
    tracking_number: string | null;
    created_at: string;
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
    paid: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Paid' },
    processing: { color: 'bg-purple-100 text-purple-700', icon: Package, label: 'Processing' },
    shipped: { color: 'bg-indigo-100 text-indigo-700', icon: Truck, label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Delivered' },
    refund_requested: { color: 'bg-orange-100 text-orange-700', icon: RefreshCw, label: 'Refund Requested' },
    refunded: { color: 'bg-stone-100 text-stone-700', icon: XCircle, label: 'Refunded' },
    cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
};

export default function OrdersPage() {
    const supabase = createClient();
    const { t } = useLanguage();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);
    const [processingRefund, setProcessingRefund] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const openDetails = (order: Order) => {
        setSelectedOrder(order);
        setDetailsOpen(true);
    };

    const openRefundDialog = (order: Order) => {
        setSelectedOrder(order);
        setRefundDialogOpen(true);
    };

    const handleRefundRequest = async () => {
        if (!selectedOrder) return;
        setProcessingRefund(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'refund_requested', updated_at: new Date().toISOString() })
                .eq('id', selectedOrder.id);

            if (error) throw error;

            setRefundDialogOpen(false);
            fetchOrders();
            setMessage({ type: 'success', text: 'Refund request submitted. We will contact you shortly.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setProcessingRefund(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount);
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
                <h1 className="text-2xl font-semibold text-stone-800">{t('account.orders')}</h1>
                <p className="text-stone-500 mt-1">{t('account.orders_desc')}</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {orders.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Package className="w-12 h-12 mx-auto text-stone-300 mb-4" />
                        <p className="text-stone-500">{t('account.no_orders')}</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = status.icon;

                        return (
                            <Card key={order.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    {/* Order Info */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="text-sm text-stone-500">
                                                    {t('account.order_date')}: {formatDate(order.created_at)}
                                                </p>
                                                <p className="text-xs text-stone-400 font-mono mt-1">
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </p>
                                            </div>
                                            <Badge className={`${status.color} border-0`}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {status.label}
                                            </Badge>
                                        </div>

                                        {/* Items Preview */}
                                        <div className="space-y-2 mb-4">
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                                                                <Package className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                                                        <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-xs text-stone-400">+{order.items.length - 2} more items</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                            <p className="font-semibold text-stone-800">
                                                {formatCurrency(order.total_amount, order.currency)}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => openDetails(order)}>
                                                    <Eye className="w-3 h-3 mr-1" /> {t('account.view_details')}
                                                </Button>
                                                {['paid', 'processing', 'shipped', 'delivered'].includes(order.status) && (
                                                    <Button variant="ghost" size="sm" className="text-orange-600" onClick={() => openRefundDialog(order)}>
                                                        <RefreshCw className="w-3 h-3 mr-1" /> {t('account.request_refund')}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {order.tracking_number && (
                                            <p className="text-xs text-stone-500 mt-2">
                                                Tracking: <span className="font-mono">{order.tracking_number}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Order Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{t('account.order_details')}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4 py-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">{t('account.order_id')}:</span>
                                <span className="font-mono">{selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">{t('account.order_date')}:</span>
                                <span>{formatDate(selectedOrder.created_at)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">{t('account.status')}:</span>
                                <Badge className={`${statusConfig[selectedOrder.status]?.color || 'bg-stone-100'} border-0`}>
                                    {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                                </Badge>
                            </div>
                            <hr className="my-4" />
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-stone-800">{item.name}</p>
                                            <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">{formatCurrency(item.price * item.quantity, selectedOrder.currency)}</p>
                                    </div>
                                ))}
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between font-semibold text-lg">
                                <span>{t('account.total')}:</span>
                                <span>{formatCurrency(selectedOrder.total_amount, selectedOrder.currency)}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Refund Request Dialog */}
            <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('account.request_refund')}</DialogTitle>
                        <DialogDescription>
                            {t('account.refund_desc')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => setRefundDialogOpen(false)}>
                            {t('account.cancel')}
                        </Button>
                        <Button onClick={handleRefundRequest} disabled={processingRefund} className="bg-orange-600 hover:bg-orange-700">
                            {processingRefund && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {t('account.confirm_refund')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
