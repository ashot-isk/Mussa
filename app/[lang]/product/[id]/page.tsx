"use client";

import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import AddToCart from "../../../components/AddToCart";
import { ui, Lang } from "../../../i18n/config";

type Params = { params: { lang: Lang; id: string } };

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number | null;
  categoryName?: string;
};

export default function ProductPage({ params }: Params) {
  const t = ui[params.lang];
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:5074/api/products/${params.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header t={t} />
        <main className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="text-lg">Loading product...</div>
        </main>
        <Footer t={t} />
      </>
    );
  }

  if (notFound || !product) {
    return (
      <>
        <Header t={t} />
        <main className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="font-serif text-3xl mb-4">Product Not Found</h1>
          <p className="text-dark/70 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <a
            href={`/${params.lang}/shop`}
            className="px-6 py-3 bg-accent text-white rounded-full text-xs uppercase tracking-[0.12em] inline-block"
          >
            Back to Shop
          </a>
        </main>
        <Footer t={t} />
      </>
    );
  }

  return (
    <>
      <Header t={t} />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="rounded-xl overflow-hidden shadow-card">
            <img
              src={
                product.imageUrl
                  ? `http://localhost:5074${product.imageUrl}`
                  : "/images/MussaMain.JPG"
              }
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex flex-col gap-6">
            {product.categoryName && (
              <div className="text-sm text-gray-500 uppercase tracking-wider">
                {product.categoryName}
              </div>
            )}
            <h1 className="font-serif text-3xl">{product.name}</h1>
            <div className="text-2xl font-medium text-dark">
              {product.price.toLocaleString("ru-RU")} ֏
            </div>
            <p className="text-dark/70">{product.description}</p>

            <div>
              <h3 className="font-medium mb-2">
                {t.product?.availability || "Availability"}
              </h3>
              <p
                className={`text-sm ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </p>
            </div>

            <div className="pt-4">
              <AddToCart
                id={product.id}
                name={product.name}
                price={product.price}
                lang={params.lang}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer t={t} />
    </>
  );
}
