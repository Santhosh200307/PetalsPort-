import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("petalsport_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("petalsport_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 10, mode = "retail") => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id && p.mode === mode);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          unit: product.unit,
          mode,
          price: mode === "wholesale" ? product.wholesalePrice : product.retailPrice,
          qty,
        },
      ];
    });
  };

  const updateQty = (id, mode, qty) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id && p.mode === mode ? { ...p, qty: Math.max(1, qty) } : p))
    );
  };

  const removeItem = (id, mode) => {
    setItems((prev) => prev.filter((p) => !(p.id === id && p.mode === mode)));
  };

  const clear = () => setItems([]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
