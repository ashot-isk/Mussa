"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/AuthProvider";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  deliveryDate: string | null;
  deliveryTime: string;
  notes: string;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function AdminOrdersPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/en/admin/login");
      return;
    }
    fetchOrders();
  }, [user, token, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5074/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(
        `http://localhost:5074/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (res.ok) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updatedOrder = await res.json();
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const togglePaymentStatus = async (orderId: number, isPaid: boolean) => {
    try {
      const res = await fetch(
        `http://localhost:5074/api/orders/${orderId}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isPaid: !isPaid }),
        }
      );
      if (res.ok) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updatedOrder = await res.json();
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (err) {
      console.error("Failed to update payment status", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <button
            onClick={() => router.push("/en/admin")}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Orders List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                All Orders ({orders.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
              {orders.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">No orders yet</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedOrder?.id === order.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {order.customerName}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.customerEmail}</p>
                      <p>{order.customerPhone}</p>
                      <p className="font-semibold text-gray-900">
                        {order.totalAmount.toLocaleString("ru-RU")} ֏
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow">
            {selectedOrder ? (
              <div>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">
                    Order #{selectedOrder.id} Details
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Customer
                    </h3>
                    <div className="text-sm space-y-1">
                      <p>{selectedOrder.customerName}</p>
                      <p className="text-gray-600">
                        {selectedOrder.customerEmail}
                      </p>
                      <p className="text-gray-600">
                        {selectedOrder.customerPhone}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Delivery
                    </h3>
                    <div className="text-sm space-y-1">
                      <p>{selectedOrder.deliveryAddress}</p>
                      {selectedOrder.deliveryDate && (
                        <p className="text-gray-600">
                          Date:{" "}
                          {new Date(
                            selectedOrder.deliveryDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {selectedOrder.deliveryTime && (
                        <p className="text-gray-600">
                          Time: {selectedOrder.deliveryTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Items
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm border-b border-gray-100 pb-2"
                        >
                          <span>
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {item.subtotal.toLocaleString("ru-RU")} ֏
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold pt-2">
                        <span>Total</span>
                        <span>
                          {selectedOrder.totalAmount.toLocaleString("ru-RU")} ֏
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Payment
                    </h3>
                    <div className="text-sm space-y-1">
                      <p>Method: {selectedOrder.paymentMethod}</p>
                      <div className="flex items-center gap-2">
                        <span>Status:</span>
                        <button
                          onClick={() =>
                            togglePaymentStatus(
                              selectedOrder.id,
                              selectedOrder.isPaid
                            )
                          }
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            selectedOrder.isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedOrder.isPaid ? "Paid" : "Unpaid"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Notes
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Update Status
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {["Pending", "Processing", "Completed", "Cancelled"].map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() =>
                              updateOrderStatus(selectedOrder.id, status)
                            }
                            className={`px-3 py-2 rounded text-xs font-medium ${
                              selectedOrder.status === status
                                ? getStatusColor(status)
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
