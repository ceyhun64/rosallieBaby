"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./sideBar";
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  XCircle,
  CheckCircle,
  Clock,
  Truck,
  X,
  ShoppingBag,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/order/user`);
        const data = await res.json();
        if (data.status === "success") {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/order/user`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        setShowDialog(false);
        setSelectedOrder(null);
      } else {
        alert("Failed to cancel order: " + data.error);
      }
    } catch (error) {
      console.error("Order cancel failed:", error);
      alert("An error occurred while cancelling the order.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        label: "Pending",
      },
      processing: {
        icon: Package,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        label: "Processing",
      },
      shipped: {
        icon: Truck,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
        label: "Shipped",
      },
      delivered: {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        label: "Delivered",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        label: "Cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 p-6 md:p-12 bg-slate-50/30">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-slate-500">
              Track and manage your order history
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg border border-slate-200 p-12">
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                <ShoppingBag className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No orders yet
              </h3>
              <p className="text-sm text-slate-500 text-center max-w-sm">
                Start shopping to see your orders here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const canCancel =
                  order.status !== "cancelled" &&
                  order.status !== "shipped" &&
                  order.status !== "delivered";
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
                  >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">
                              Order #{order.id}
                            </h3>
                            <div className="flex items-center text-xs text-slate-500 mt-1">
                              <Calendar className="h-3.5 w-3.5 mr-1.5" />
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}
                        >
                          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                          <span className={`text-xs font-medium ${statusConfig.color} capitalize`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-5">
                      {/* Payment Info */}
                      <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center text-sm">
                          <CreditCard className="h-4 w-4 mr-2 text-slate-400" />
                          <span className="text-slate-600 mr-2">Payment:</span>
                          <span className="font-medium text-slate-900">
                            {order.paidPrice} {order.currency}
                          </span>
                        </div>
                        {order.paymentMethod && (
                          <div className="text-xs text-slate-500 ml-6">
                            {order.paymentMethod}
                          </div>
                        )}
                      </div>

                      {/* Addresses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="bg-slate-50 rounded-lg p-4"
                          >
                            <div className="flex items-center mb-2">
                              <MapPin className="h-3.5 w-3.5 mr-2 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-900 capitalize uppercase tracking-wide">
                                {addr.type} Address
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 space-y-1 ml-5">
                              <p className="font-medium text-slate-900">
                                {addr.firstName} {addr.lastName}
                              </p>
                              <p>{addr.phone}</p>
                              <p>
                                {addr.address}, {addr.district}
                              </p>
                              <p>
                                {addr.city} {addr.zip}, {addr.country}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                          Order Items
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                                  <img
                                    src={item.product.mainImage}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900 line-clamp-1">
                                    {item.product.name}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-medium text-slate-900">
                                {item.totalPrice} {order.currency}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="text-base font-semibold text-slate-900">
                          Total: {order.totalPrice} {order.currency}
                        </div>

                        {canCancel && (
                          <Button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDialog(true);
                            }}
                            disabled={updating}
                            className="h-9 px-4 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      {showDialog && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Confirm Cancellation
              </h3>
              <button
                onClick={() => {
                  setShowDialog(false);
                  setSelectedOrder(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to cancel order #{selectedOrder.id}? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => {
                  setShowDialog(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium"
              >
                Keep Order
              </Button>
              <Button
                onClick={() => handleCancelOrder(selectedOrder.id)}
                disabled={updating}
                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Cancelling...
                  </>
                ) : (
                  "Cancel Order"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}