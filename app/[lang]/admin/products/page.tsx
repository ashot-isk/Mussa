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
  isAvailable: boolean;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
};

type Category = {
  id: number;
  name: string;
};

type Flower = {
  id: number;
  name: string;
  stockQuantity: number;
  unitPrice: number;
};

type Material = {
  id: number;
  name: string;
  stockQuantity: number;
  unitPrice: number;
};

type ProductFlower = {
  flowerId: number;
  quantity: number;
};

type ProductMaterial = {
  materialId: number;
  quantity: number;
};

export default function AdminProducts({ params }: { params: { lang: Lang } }) {
  const t = ui[params.lang];
  const { user, token, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAvailable, setIsAvailable] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedFlowers, setSelectedFlowers] = useState<ProductFlower[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<ProductMaterial[]>(
    [],
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Calculate total cost of flowers and materials
  const calculateCost = () => {
    let total = 0;

    selectedFlowers.forEach((sf) => {
      const flower = flowers.find((f) => f.id === sf.flowerId);
      if (flower) {
        total += flower.unitPrice * sf.quantity;
      }
    });

    selectedMaterials.forEach((sm) => {
      const material = materials.find((m) => m.id === sm.materialId);
      if (material) {
        // Material price is per meter, quantity is in cm, so divide by 100
        total += material.unitPrice * (sm.quantity / 100);
      }
    });

    return total;
  };

  const totalCost = calculateCost();

  // Auto-fill recommended price when flowers/materials change
  useEffect(() => {
    if (totalCost > 0 && !editingId) {
      const recommendedPrice = (totalCost * 2.5).toFixed(2);
      setPrice(recommendedPrice);
    }
  }, [totalCost, editingId]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.lang}/admin/login`);
      return;
    }

    if (user) {
      // Verify token is still valid
      checkAuth();

      fetchProducts();
      fetchCategories();
      fetchFlowers();
      fetchMaterials();

      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        fetchProducts();
        fetchFlowers();
        fetchMaterials();
      }, 5000);

      // Refresh when page becomes visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchProducts();
          fetchFlowers();
          fetchMaterials();
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
  }, [user, isLoading, router, params.lang]);

  const fetchFlowers = async () => {
    try {
      const response = await fetch("http://localhost:5074/api/flowers");
      if (response.ok) {
        const data = await response.json();
        setFlowers(data);
      }
    } catch (err) {
      console.error("Failed to fetch flowers", err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch("http://localhost:5074/api/materials");
      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      }
    } catch (err) {
      console.error("Failed to fetch materials", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5074/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5074/api/products?includeInactive=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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

    const stockQuantity = parseInt(stock);

    // Validate price is not less than cost
    const priceValue = parseFloat(price);
    if (priceValue < totalCost) {
      setError(
        `Price cannot be less than cost (${totalCost.toFixed(
          2,
        )} ֏). Please adjust the price.`,
      );
      return;
    }

    // Validate stock availability for flowers and materials
    for (const sf of selectedFlowers) {
      const flower = flowers.find((f) => f.id === sf.flowerId);
      if (flower) {
        const requiredQuantity = sf.quantity * stockQuantity;
        if (flower.stockQuantity < requiredQuantity) {
          setError(
            `Not enough stock for ${flower.name}. Required: ${requiredQuantity}, Available: ${flower.stockQuantity}`,
          );
          return;
        }
      }
    }

    for (const sm of selectedMaterials) {
      const material = materials.find((m) => m.id === sm.materialId);
      if (material) {
        const requiredQuantityCm = sm.quantity * stockQuantity;
        const requiredQuantityMeters = requiredQuantityCm / 100;
        if (material.stockQuantity < requiredQuantityMeters) {
          setError(
            `Not enough stock for ${
              material.name
            }. Required: ${requiredQuantityCm}cm, Available: ${(
              material.stockQuantity * 100
            ).toFixed(0)}cm`,
          );
          return;
        }
      }
    }

    if (!token) {
      setError("Not authenticated. Please login again.");
      router.push(`/${params.lang}/admin/login`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        // For updates, send product data with flowers and materials
        const updatedProduct = {
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          stock: parseInt(stock),
          categoryId: categoryId || null,
          imageUrl: "",
          isFeatured: false,
          isAvailable,
          flowers: selectedFlowers,
          materials: selectedMaterials,
        };

        const response = await fetch(
          `http://localhost:5074/api/products/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedProduct),
          },
        );

        if (response.ok) {
          // Upload image if selected
          if (imageFile) {
            await handleImageUpload(editingId);
          }
          await fetchProducts();
          await fetchFlowers();
          await fetchMaterials();
          resetForm();
        } else if (response.status === 401) {
          setError("Authentication failed. Please login again.");
          router.push(`/${params.lang}/admin/login`);
        } else {
          const errorText = await response.text();
          setError(`Failed to update product: ${errorText}`);
        }
      } else {
        // For new products
        const productData = {
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          stock: parseInt(stock),
          categoryId: categoryId || null,
          imageUrl: "",
          isFeatured: false,
          isAvailable,
          flowers: selectedFlowers,
          materials: selectedMaterials,
        };

        const response = await fetch(
          "http://localhost:5074/api/products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          },
        );

        if (response.ok) {
          const createdProduct = await response.json();

          // Upload image if selected
          if (imageFile && createdProduct.id) {
            await handleImageUpload(createdProduct.id);
          }

          await fetchProducts();
          await fetchFlowers();
          await fetchMaterials();
          resetForm();
        } else if (response.status === 401) {
          setError("Authentication failed. Please login again.");
          router.push(`/${params.lang}/admin/login`);
        } else {
          const errorText = await response.text();
          setError(`Failed to create product: ${errorText}`);
        }
      }
    } catch (err) {
      setError("Network error");
      console.error("Error submitting product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (productId: string) => {
    if (!imageFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch(
        `http://localhost:5074/api/products/${productId}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        setError("Failed to upload image");
      }
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (product: Product) => {
    setEditingId(product.id);
    setIsAvailable(product.isAvailable);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setCategoryId(product.categoryId ? product.categoryId.toString() : "");

    // Fetch full product details including flowers and materials
    try {
      const response = await fetch(
        `http://localhost:5074/api/products/${product.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.ok) {
        const fullProduct = await response.json();
        setIsAvailable(fullProduct.isAvailable);

        // Load flowers
        if (fullProduct.flowers && fullProduct.flowers.length > 0) {
          const loadedFlowers: ProductFlower[] = fullProduct.flowers.map(
            (f: any) => ({
              flowerId: f.flowerId,
              quantity: f.quantity,
            }),
          );
          setSelectedFlowers(loadedFlowers);
        }

        // Load materials
        if (fullProduct.materials && fullProduct.materials.length > 0) {
          const loadedMaterials: ProductMaterial[] = fullProduct.materials.map(
            (m: any) => ({
              materialId: m.materialId,
              quantity: m.quantity,
            }),
          );
          setSelectedMaterials(loadedMaterials);
        }
      }
    } catch (err) {
      console.error("Failed to load product details:", err);
    }
  };

  const handleStatusChange = async (product: Product) => {
    if (updatingStatusId !== null) return;
    setStatusError("");
    setUpdatingStatusId(product.id);
    try {
      const response = await fetch(
        `http://localhost:5074/api/products/${product.id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isAvailable: !product.isAvailable }),
        },
      );
      if (!response.ok) {
        setStatusError(
          response.status === 401
            ? "Your session has expired. Please sign in again."
            : "Could not update product status. Please try again.",
        );
        if (response.status === 401) checkAuth();
        return;
      }
      const updated = await response.json();
      setProducts((current) =>
        current.map((p) =>
          p.id === product.id ? { ...p, isAvailable: updated.isAvailable } : p,
        ),
      );
      if (editingId === product.id) setIsAvailable(updated.isAvailable);
    } catch {
      setStatusError("Could not connect to the API. Please try again.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId !== null) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleteError("");
    setDeletingId(id);
    try {
      const response = await fetch(`http://localhost:5074/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok || response.status === 404) {
        setProducts((current) =>
          current.filter((product) => product.id !== id),
        );
        if (editingId === id) resetForm();
        await fetchProducts();
      } else if (response.status === 409) {
        const data = await response.json();
        setDeleteError(
          data.message ||
            "This product is used by an order and cannot be deleted.",
        );
      } else if (response.status === 401) {
        setDeleteError("Your session has expired. Please sign in again.");
        checkAuth();
      } else if (response.status === 403) {
        setDeleteError("You do not have permission to delete products.");
      } else {
        setDeleteError("Could not delete the product. Please try again.");
      }
    } catch {
      setDeleteError("Could not connect to the API. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAvailable(true);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategoryId("");
    setImageFile(null);
    setSelectedFlowers([]);
    setSelectedMaterials([]);
  };

  const visibleProducts = products.filter(
    (product) =>
      statusFilter === "all" ||
      (statusFilter === "active" ? product.isAvailable : !product.isAvailable),
  );

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
              <h1 className="text-2xl font-serif text-gray-900">
                Products Management
              </h1>
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
                  Products ({visibleProducts.length})
                </h3>
              </div>
              {deleteError && (
                <p
                  role="alert"
                  className="mx-6 mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700"
                >
                  {deleteError}
                </p>
              )}
              {statusError && (
                <p role="alert" className="mx-6 mb-4 text-sm text-red-700">
                  {statusError}
                </p>
              )}
              <label className="block mx-6 mb-4 text-sm">
                Filter by status
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="ml-3 border rounded p-2"
                >
                  <option value="all">All products</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <ul className="divide-y divide-gray-200">
                {visibleProducts.map((product) => (
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
                            <h4 className="text-sm font-medium text-gray-900">
                              {product.name}
                            </h4>
                            <span
                              className={`inline-block rounded px-2 py-1 text-xs ${product.isAvailable ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-600"}`}
                            >
                              {product.isAvailable ? "Active" : "Inactive"}
                            </span>
                            <p className="text-sm text-gray-500">
                              ${product.price} • Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusChange(product)}
                          disabled={updatingStatusId !== null}
                          className="text-sm underline disabled:opacity-50"
                        >
                          {updatingStatusId === product.id
                            ? "Saving..."
                            : product.isAvailable
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId !== null}
                          className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {visibleProducts.length === 0 && !loading && (
                  <li className="px-4 py-8 text-center text-gray-500">
                    No products match this status.
                  </li>
                )}
              </ul>
            </div>

            {/* Add/Edit Form */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                    />
                    Active — visible in the shop and available to order
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
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
                      <label className="block text-sm font-medium text-gray-700">
                        Price (֏)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min={totalCost}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0.00"
                        required
                      />
                      {totalCost > 0 && (
                        <div className="mt-1 space-y-1">
                          <p className="text-xs text-gray-600">
                            Min cost: {totalCost.toFixed(2)} ֏
                            {parseFloat(price) > 0 &&
                              parseFloat(price) < totalCost && (
                                <span className="text-red-600 ml-1">
                                  (Price too low!)
                                </span>
                              )}
                          </p>
                          <p className="text-xs font-semibold text-green-700">
                            Recommended: {(totalCost * 2.5).toFixed(2)} ֏
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Stock
                      </label>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">No Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Flowers Selection */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flowers Used
                    </label>
                    <div className="space-y-2">
                      {flowers
                        .filter((flower) => flower.stockQuantity >= 1)
                        .map((flower) => (
                          <div
                            key={flower.id}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFlowers.some(
                                (f) => f.flowerId === flower.id,
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFlowers([
                                    ...selectedFlowers,
                                    { flowerId: flower.id, quantity: 1 },
                                  ]);
                                } else {
                                  setSelectedFlowers(
                                    selectedFlowers.filter(
                                      (f) => f.flowerId !== flower.id,
                                    ),
                                  );
                                }
                              }}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <span className="flex-1 text-sm">
                              {flower.name} (Stock: {flower.stockQuantity})
                            </span>
                            {selectedFlowers.some(
                              (f) => f.flowerId === flower.id,
                            ) && (
                              <input
                                type="number"
                                min="1"
                                max={flower.stockQuantity}
                                value={
                                  selectedFlowers.find(
                                    (f) => f.flowerId === flower.id,
                                  )?.quantity || 1
                                }
                                onChange={(e) => {
                                  setSelectedFlowers(
                                    selectedFlowers.map((f) =>
                                      f.flowerId === flower.id
                                        ? {
                                            ...f,
                                            quantity:
                                              parseInt(e.target.value) || 1,
                                          }
                                        : f,
                                    ),
                                  );
                                }}
                                className="w-20 px-2 py-1 border-gray-300 rounded-md text-sm"
                                placeholder="Qty"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Materials Selection */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Materials Used (quantity in cm)
                    </label>
                    <div className="space-y-2">
                      {materials
                        .filter((material) => material.stockQuantity >= 1)
                        .map((material) => (
                          <div
                            key={material.id}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMaterials.some(
                                (m) => m.materialId === material.id,
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMaterials([
                                    ...selectedMaterials,
                                    { materialId: material.id, quantity: 1 },
                                  ]);
                                } else {
                                  setSelectedMaterials(
                                    selectedMaterials.filter(
                                      (m) => m.materialId !== material.id,
                                    ),
                                  );
                                }
                              }}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <span className="flex-1 text-sm">
                              {material.name} (Stock:{" "}
                              {(material.stockQuantity * 100).toFixed(0)}cm,
                              Price: {material.unitPrice}֏/m)
                            </span>
                            {selectedMaterials.some(
                              (m) => m.materialId === material.id,
                            ) && (
                              <input
                                type="number"
                                min="1"
                                max={material.stockQuantity * 100}
                                value={
                                  selectedMaterials.find(
                                    (m) => m.materialId === material.id,
                                  )?.quantity || 1
                                }
                                onChange={(e) => {
                                  setSelectedMaterials(
                                    selectedMaterials.map((m) =>
                                      m.materialId === material.id
                                        ? {
                                            ...m,
                                            quantity:
                                              parseInt(e.target.value) || 1,
                                          }
                                        : m,
                                    ),
                                  );
                                }}
                                className="w-20 px-2 py-1 border-gray-300 rounded-md text-sm"
                                placeholder="cm"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Cost Summary */}
                  {(selectedFlowers.length > 0 ||
                    selectedMaterials.length > 0) && (
                    <div className="border-t pt-4 bg-blue-50 p-4 rounded-md">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Cost Breakdown:
                      </h4>
                      <div className="space-y-1 text-sm">
                        {selectedFlowers.map((sf) => {
                          const flower = flowers.find(
                            (f) => f.id === sf.flowerId,
                          );
                          if (!flower) return null;
                          const cost = flower.unitPrice * sf.quantity;
                          return (
                            <div
                              key={sf.flowerId}
                              className="flex justify-between text-gray-600"
                            >
                              <span>
                                {flower.name} × {sf.quantity}
                              </span>
                              <span>{cost.toFixed(2)} ֏</span>
                            </div>
                          );
                        })}
                        {selectedMaterials.map((sm) => {
                          const material = materials.find(
                            (m) => m.id === sm.materialId,
                          );
                          if (!material) return null;
                          // Material price is per meter, quantity is in cm
                          const cost = material.unitPrice * (sm.quantity / 100);
                          return (
                            <div
                              key={sm.materialId}
                              className="flex justify-between text-gray-600"
                            >
                              <span>
                                {material.name} × {sm.quantity} cm
                              </span>
                              <span>{cost.toFixed(2)} ֏</span>
                            </div>
                          );
                        })}
                        <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-semibold text-gray-800">
                          <span>Total Cost:</span>
                          <span>{totalCost.toFixed(2)} ֏</span>
                        </div>
                        <div className="flex justify-between font-semibold text-green-700 mt-1">
                          <span>Recommended Price (2.5×):</span>
                          <span>{(totalCost * 2.5).toFixed(2)} ֏</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {imageFile && (
                      <p className="mt-1 text-xs text-gray-500">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>

                  {error && <div className="text-red-600 text-sm">{error}</div>}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={submitting || uploading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {submitting || uploading
                        ? "Saving..."
                        : editingId
                          ? "Update Product"
                          : "Add Product"}
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
