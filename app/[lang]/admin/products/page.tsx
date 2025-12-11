"use client";

import { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { ui, Lang } from "../../../i18n/config";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function AdminProducts({ params }: { params: { lang: Lang } }) {
  const t = ui[params.lang];
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addProduct = () => {
    if (!name || !price) return;
    setProducts(prev => [
      ...prev,
      { id: Date.now().toString(), name, price: Number(price) || 0 }
    ]);
    setName("");
    setPrice("");
  };

  return (
    <>
      <Header t={t} />
      <main className="max-w-4xl mx-auto px-6 py-16 text-sm">
        <h1 className="font-serif text-3xl mb-6">Admin – Products (demo)</h1>
        <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-3">
          <div>
            <label className="block mb-1">Name</label>
            <input
              className="border border-black/10 rounded px-3 py-2 w-full"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Bouquet name"
            />
          </div>
          <div>
            <label className="block mb-1">Price</label>
            <input
              className="border border-black/10 rounded px-3 py-2 w-full"
              value={price}
              onChange={e => setPrice(e.target.value)}
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
