"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  
  // ✅ Así Zustand re-renderiza cuando cambia
  const itemCount = useCartStore((state: any) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mostrar sin contador hasta que monte
  if (!mounted) {
    return (
      <Link href="/cart" className="text-2xl">
       {/* <i className="bi bi-bag"></i> */}
       <i className="bi bi-duffle"></i>
      </Link>
    );
  }

  return (
    <Link href="/cart" className="relative text-2xl">
      <i className="bi bi-duffle"></i>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-highlight  text-white rounded-full px-2 py-0.5 text-xs">
          {itemCount}
        </span>
      )}
    </Link>
  );
}