import { create } from "zustand";
import { GroceryCategory, GroceryItem, Priority } from "../types/grocery";

interface GroceryState {
  items: GroceryItem[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  toggleItem: (id: string) => void;
  addItem: (item: {
    name: string;
    category: GroceryCategory;
    quantity: number;
    unit: string;
    priority?: Priority;
  }) => void;
  deleteItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCompleted: () => void;
}

const INITIAL_ITEMS: GroceryItem[] = [
  {
    id: "1",
    name: "Organic Avocados",
    category: "Produce",
    quantity: 3,
    unit: "pcs",
    priority: "high",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Oat Milk (Barista)",
    category: "Dairy",
    quantity: 2,
    unit: "cartons",
    priority: "medium",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Artisan Sourdough",
    category: "Bakery",
    quantity: 1,
    unit: "loaf",
    priority: "low",
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Free-range Eggs",
    category: "Dairy",
    quantity: 12,
    unit: "pack",
    priority: "high",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Greek Olive Oil",
    category: "Pantry",
    quantity: 1,
    unit: "bottle",
    priority: "low",
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
];

export const useGroceryStore = create<GroceryState>((set) => ({
  items: INITIAL_ITEMS,
  selectedCategory: "All",

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  toggleItem: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      ),
    })),

  addItem: (newItem) =>
    set((state) => ({
      items: [
        {
          ...newItem,
          id: Date.now().toString(),
          priority: newItem.priority || "medium",
          isCompleted: false,
          createdAt: new Date().toISOString(),
        },
        ...state.items,
      ],
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, delta) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    })),

  clearCompleted: () =>
    set((state) => ({
      items: state.items.filter((item) => !item.isCompleted),
    })),
}));
