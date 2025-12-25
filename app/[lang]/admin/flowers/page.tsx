"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/AuthProvider";
import { Lang } from "../../../i18n/config";

interface Flower {
  id: number;
  name: string;
  description?: string;
  stockQuantity: number;
  unitPrice: number;
  imageUrl?: string;
  createdAt: string;
}

export default function FlowersPage({ params }: { params: { lang: Lang } }) {
  const { user, isLoading, checkAuth } = useAuth();
  const router = useRouter();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFlower, setEditingFlower] = useState<Flower | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stockQuantity: "" as any,
    unitPrice: "" as any,
    imageUrl: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.lang}/admin/login`);
    } else if (user) {
      checkAuth();
    }
  }, [user, isLoading, router, params.lang]);

  useEffect(() => {
    if (user) {
      fetchFlowers();

      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        fetchFlowers();
      }, 5000);

      // Refresh when page becomes visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchFlowers();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [user]);

  const fetchFlowers = async () => {
    try {
      const response = await fetch("http://localhost:5074/api/flowers");
      const data = await response.json();
      setFlowers(data);
    } catch (error) {
      console.error("Error fetching flowers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const url = editingFlower
        ? `http://localhost:5074/api/flowers/${editingFlower.id}`
        : "http://localhost:5074/api/flowers";

      const response = await fetch(url, {
        method: editingFlower ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          stockQuantity: parseInt(formData.stockQuantity) || 0,
          unitPrice: parseFloat(formData.unitPrice) || 0,
          imageUrl: formData.imageUrl,
        }),
      });

      if (response.ok) {
        fetchFlowers();
        setShowForm(false);
        setEditingFlower(null);
        setFormData({
          name: "",
          description: "",
          stockQuantity: "" as any,
          unitPrice: "" as any,
          imageUrl: "",
        });
      }
    } catch (error) {
      console.error("Error saving flower:", error);
    }
  };

  const handleEdit = (flower: Flower) => {
    setEditingFlower(flower);
    setFormData({
      name: flower.name,
      description: flower.description || "",
      stockQuantity: flower.stockQuantity,
      unitPrice: flower.unitPrice,
      imageUrl: flower.imageUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (deletingId !== null) return;
    if (!confirm("Are you sure you want to delete this flower?")) return;

    setDeleteError("");
    setDeletingId(id);
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://localhost:5074/api/flowers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok || response.status === 404) {
        setFlowers((current) => current.filter((flower) => flower.id !== id));
        if (editingFlower?.id === id) {
          setEditingFlower(null);
          setShowForm(false);
        }
        await fetchFlowers();
      } else if (response.status === 409) {
        const data = await response.json();
        setDeleteError(
          data.message ||
            "Remove this flower from its products before deleting it.",
        );
      } else if (response.status === 401) {
        setDeleteError("Your session has expired. Please sign in again.");
        checkAuth();
      } else if (response.status === 403) {
        setDeleteError("You do not have permission to delete flowers.");
      } else {
        setDeleteError("Could not delete the flower. Please try again.");
      }
    } catch {
      setDeleteError("Could not connect to the API. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-serif text-gray-900">
              Manage Flowers
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingFlower(null);
                  setFormData({
                    name: "",
                    description: "",
                    stockQuantity: 0,
                    unitPrice: 0,
                    imageUrl: "",
                  });
                }}
                className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md"
              >
                {showForm ? "Cancel" : "Add Flower"}
              </button>
              <button
                onClick={() => router.push(`/${params.lang}/admin`)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Back to Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {deleteError && (
          <p
            role="alert"
            className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700"
          >
            {deleteError}
          </p>
        )}
        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingFlower ? "Edit Flower" : "Add New Flower"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit Price (֏) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unitPrice: parseFloat(e.target.value),
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md"
              >
                {editingFlower ? "Update Flower" : "Add Flower"}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price (֏)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flowers.map((flower) => (
                <tr key={flower.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {flower.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {flower.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {flower.stockQuantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {flower.unitPrice.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(flower)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(flower.id)}
                      disabled={deletingId !== null}
                      className="text-red-600 hover:text-red-900"
                    >
                      {deletingId === flower.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {flowers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No flowers found. Add your first flower above.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
