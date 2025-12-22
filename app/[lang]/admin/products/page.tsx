"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/AuthProvider";
import { ui, Lang } from "../../../i18n/config";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export default function AdminProducts({ params }: { params: { lang: Lang } }) {
  const t = ui[params.lang];
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.lang}/admin/login`);
      return;
    }

    if (user) {
      fetchProducts();
    }
  }, [user, isLoading, router, params.lang]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5074/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !stock) return;

    setSubmitting(true);
    setError("");

    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock),
      imageUrl: ""
    };

    try {
      const url = editingId
        ? `http://localhost:5074/api/products/${editingId}`
        : 'http://localhost:5074/api/products';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingId ? { ...productData, id: editingId } : productData),
      });

      if (response.ok) {
        await fetchProducts();
        resetForm();
      } else {
        setError(editingId ? "Failed to update product" : "Failed to create product");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5074/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        setError("Failed to delete product");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push(`/${params.lang}/admin`)}
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-serif text-gray-900">Products Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Products List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Products ({products.length})
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          {product.imageUrl && (
                            <img
                              src={`http://localhost:5074${product.imageUrl}`}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover mr-4"
                            />
                          )}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">${product.price} • Stock: {product.stock}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {products.length === 0 && !loading && (
                  <li className="px-4 py-8 text-center text-gray-500">
                    No products found. Create your first product below.
                  </li>
                )}
              </ul>
            </div>

            {/* Add/Edit Form */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
              placeholder="48000"
            />
          </div>
          <button
            onClick={addProduct}
            className="px-4 py-2 bg-accent text-white rounded-full text-xs uppercase tracking-[0.12em]"
          >
            Add product
          </button>
        </div>
        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} className="flex justify-between border-b border-black/5 pb-1">
              <span>{p.name}</span>
              <span>{p.price.toLocaleString("ru-RU")} ֏</span>
            </div>
          ))}
          {products.length === 0 && <p>No products yet (local state only).</p>}
        </div>
      </main>
      <Footer t={t} />
    </>
  );
}
