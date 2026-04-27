"use client";
import { useState, useEffect, useCallback } from "react";
import { RECIPES, TECHS, STOCK, MENU_ITEMS, STAFF, SUPPLIERS } from "@/lib/data";
import type { Recipe, Technique } from "@/lib/data";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export type StockItem = typeof STOCK[0] & { id: number };
export type MenuItem  = typeof MENU_ITEMS[0];
export type StaffMember = typeof STAFF[0];
export type Supplier  = typeof SUPPLIERS[0];

// ── Stock ─────────────────────────────────────────────────────
export function useStock() {
  const [items, setItems] = useState<StockItem[]>([]);

  useEffect(() => {
    setItems(load("rasoi_stock", STOCK as StockItem[]));
  }, []);

  const update = useCallback((id: number, patch: Partial<StockItem>) => {
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, ...patch } : i);
      save("rasoi_stock", next);
      return next;
    });
  }, []);

  const add = useCallback((item: Omit<StockItem, "id">) => {
    setItems(prev => {
      const next = [...prev, { ...item, id: Date.now() }];
      save("rasoi_stock", next);
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      save("rasoi_stock", next);
      return next;
    });
  }, []);

  return { items, update, add, remove };
}

// ── Recipes ───────────────────────────────────────────────────
export function useRecipes() {
  const [items, setItems] = useState<Recipe[]>([]);

  useEffect(() => {
    setItems(load("rasoi_recipes", RECIPES));
  }, []);

  const setActive = useCallback((id: number) => {
    setItems(prev => {
      const next = prev.map(r => ({ ...r, active: r.id === id }));
      save("rasoi_recipes", next);
      return next;
    });
  }, []);

  const update = useCallback((id: number, patch: Partial<Recipe>) => {
    setItems(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...patch } : r);
      save("rasoi_recipes", next);
      return next;
    });
  }, []);

  return { items, setActive, update };
}

// ── Menu ──────────────────────────────────────────────────────
export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setItems(load("rasoi_menu", MENU_ITEMS));
  }, []);

  const update = useCallback((name: string, patch: Partial<MenuItem>) => {
    setItems(prev => {
      const next = prev.map(i => i.name === name ? { ...i, ...patch } : i);
      save("rasoi_menu", next);
      return next;
    });
  }, []);

  const add = useCallback((item: MenuItem) => {
    setItems(prev => {
      const next = [...prev, item];
      save("rasoi_menu", next);
      return next;
    });
  }, []);

  const remove = useCallback((name: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.name !== name);
      save("rasoi_menu", next);
      return next;
    });
  }, []);

  return { items, update, add, remove };
}

// ── Staff ─────────────────────────────────────────────────────
export function useStaff() {
  const [members, setMembers] = useState<StaffMember[]>([]);

  useEffect(() => {
    setMembers(load("rasoi_staff", STAFF));
  }, []);

  const update = useCallback((name: string, patch: Partial<StaffMember>) => {
    setMembers(prev => {
      const next = prev.map(s => s.name === name ? { ...s, ...patch } : s);
      save("rasoi_staff", next);
      return next;
    });
  }, []);

  const add = useCallback((member: StaffMember) => {
    setMembers(prev => {
      const next = [...prev, member];
      save("rasoi_staff", next);
      return next;
    });
  }, []);

  const remove = useCallback((name: string) => {
    setMembers(prev => {
      const next = prev.filter(s => s.name !== name);
      save("rasoi_staff", next);
      return next;
    });
  }, []);

  return { members, update, add, remove };
}

// ── Suppliers ─────────────────────────────────────────────────
export function useSuppliers() {
  const [items, setItems] = useState<Supplier[]>([]);

  useEffect(() => {
    setItems(load("rasoi_suppliers", SUPPLIERS as Supplier[]));
  }, []);

  const update = useCallback((id: number, patch: Partial<Supplier>) => {
    setItems(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...patch } : s);
      save("rasoi_suppliers", next);
      return next;
    });
  }, []);

  return { items, update };
}
