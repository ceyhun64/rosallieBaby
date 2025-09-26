"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./sideBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/order/user`);
        const data = await res.json();
        if (data.status === "success") {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Siparişler alınamadı:", error);
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
        setSelectedOrder(null); // Dialog kapansın
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <div className="w-full max-w-5xl md:mt-32 md:ms-20 px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">My Orders</h2>

        {loading ? (
          <div className="p-4 text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-4 rounded-md bg-blue-100 text-sm text-gray-600">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              // Cancel Button logic
              const canCancel =
                order.status !== "cancelled" &&
                order.status !== "shipped" &&
                order.status !== "delivered";

              return (
                <Card key={order.id} className="rounded-xl shadow-md">
                  <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                      <CardTitle className="text-lg text-gray-800">
                        Order No: {order.id}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}{" "}
                        •{" "}
                        {new Date(order.createdAt).toLocaleTimeString("tr-TR")}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-700 capitalize">
                      {order.status}
                    </span>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                      <p>
                        <strong>Paid Price:</strong> {order.paidPrice}{" "}
                        {order.currency}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {order.paymentMethod || "—"}
                      </p>
                      <p>
                        <strong>Transaction ID:</strong>{" "}
                        {order.transactionId || "—"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {order.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="bg-gray-50 p-3 rounded-md text-gray-700"
                        >
                          <p className="font-semibold capitalize mb-1">
                            {addr.type} Address
                          </p>
                          <p>
                            {addr.firstName} {addr.lastName}
                          </p>
                          <p>{addr.phone}</p>
                          <p>
                            {addr.address}, {addr.district}, {addr.city}{" "}
                            {addr.zip}
                          </p>
                          <p>{addr.country}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between border-b pb-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.mainImage}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="text-gray-700 font-medium line-clamp-1">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-teal-700 font-semibold">
                            {item.totalPrice} {order.currency}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-4 items-center">
                      <p className="text-gray-700 font-bold">
                        Total: {order.totalPrice} {order.currency}
                      </p>

                      {canCancel && (
                        <Dialog
                          open={selectedOrder?.id === order.id}
                          onOpenChange={(open) =>
                            !open && setSelectedOrder(null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              disabled={updating}
                            >
                              {updating ? "Cancelling..." : "Cancel Order"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Cancellation</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to cancel order {order.id}
                                ?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex gap-2 justify-end">
                              <DialogClose className="px-3 py-1 bg-gray-300 rounded-md">
                                No
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={updating}
                              >
                                Yes, Cancel
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
