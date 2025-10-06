
"use client";

import { useEffect, useState } from "react";
import { Order, OrderAPI } from "@/lib/endpoints";
import Link from "next/link";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await OrderAPI.getMyOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded-lg">
              <div className="flex justify-between">
                <h2 className="font-bold">Order #{order.id}</h2>
                <span className={`px-2 py-1 text-sm rounded-full ${order.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600">Total: ${order.total_price.toFixed(2)}</p>
              <div className="mt-2">
                <h3 className="font-semibold">Items:</h3>
                <ul className="list-disc list-inside">
                  {order.items.map((item) => (
                    <li key={item.id}>{item.productName} - {item.quantity} x ${item.price.toFixed(2)}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2 text-right">
                <Link href={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
