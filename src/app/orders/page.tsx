"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Order, OrderAPI } from "@/lib/endpoints";
import withAuth from "@/lib/with-auth";

const OrderStatuses = ["PENDING", "SUCCESS", "FAILED", "VALID", "CANCELED"];

type DecodedToken = {
  user_id: number;
  role: string;
  exp: number;
};

function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState("PENDING");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const decodedToken = jwtDecode<DecodedToken>(token);
        const buyerId = decodedToken.user_id;

        const fetchedOrders = await OrderAPI.getOrdersByBuyerAndStatus(buyerId, activeStatus);
        setOrders(fetchedOrders);
      } catch (err: any) { 
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeStatus]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="flex border-b mb-6">
        {OrderStatuses.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 -mb-px font-medium text-sm transition-colors duration-200 ease-in-out 
              ${activeStatus === status
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full 
                      ${
                        order.status === "SUCCESS"
                          ? "bg-green-100 text-green-800"
                          : order.status === "FAILED" || order.status === "CANCELED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`
                    }>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Total: ${order.total_price.toFixed(2)}</p>
                <div>
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-gray-700">
                        {item.productName} - {item.quantity} x ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found with status {activeStatus}.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default withAuth(OrdersPage, ['buyer']);
