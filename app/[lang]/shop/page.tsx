"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ui, Lang } from "../../i18n/config";
import ProductCard from "../../components/ProductCard";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number | null;
};

type Category = {
  id: number;
  name: string;
};

export default function ShopPage({ params }: { params: { lang: Lang } }) {
  const t = ui[params.lang];
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("http://localhost:5074/api/products"),
        fetch("http://localhost:5074/api/categories"),
      ]);

      if (productsRes.ok && categoriesRes.ok) {
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData);
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  return (
    <>
      <Header t={t} />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl mb-6">{t.nav?.shop || "Shop"}</h1>

        {/* Category Filter */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === null
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Flowers
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === category.id
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products available yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {filteredProducts.map((product) => {
              const category = categories.find(
                (c) => c.id === product.categoryId
              );
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={
                    product.imageUrl
                      ? `http://localhost:5074${product.imageUrl}`
                      : "/product images/119A1411.JPG"
                  }
                  lang={params.lang}
                  categoryName={category?.name}
                />
              );
            })}
          </div>
        )}
      </main>
      <Footer t={t} />
    </>
  );
}
