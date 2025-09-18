"use client";

import React from "react";
import Sidebar from "./sideBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const orders = [
  {
    id: "ORD-2025-001",
    date: "14.09.2025",
    status: "Shipped",
    total: 1899,
    items: [
      {
        id: 1,
        name: "Anchor Muslin 6-Piece Baby Hospital Outfit Set",
        qty: 1,
        price: 1899,
        image: "/allProducts/product1main.webp",
      },
    ],
  },
  {
    id: "ORD-2025-002",
    date: "05.09.2025",
    status: "Delivered",
    total: 3698,
    items: [
      {
        id: 2,
        name: "Flowery Muslin 6-Piece Baby Hospital Outfit Set",
        qty: 2,
        price: 1849,
        image: "/allProducts/product2main.webp",
      },
    ],
  },
];

export default function Orders() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full max-w-4xl md:mt-32 ms-20 mt-20 px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">My Orders</h2>

        {orders.length === 0 ? (
          <div className="p-4 rounded-md bg-blue-100 text-sm text-gray-600">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="rounded-xl shadow-sm">
                <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
                  <div>
                    <CardTitle className="text-lg text-gray-800">
                      Order No: {order.id}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-700">
                    {order.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="text-gray-700 font-medium line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.qty}
                            </p>
                          </div>
                        </div>
                        <p className="text-teal-700 font-semibold">
                          €{item.price * item.qty}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <p className="text-gray-700 font-bold">
                      Total: €{order.total}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
