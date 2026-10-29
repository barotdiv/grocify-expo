import { create } from "zustand"
import { GroceryCategory, GroceryItem } from "../types/grocery"

interface GroceryState {
    items: GroceryItem[]
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    // Backward compatibility aliases for typo
    selectedCateogry: string
    setSelectedCateogry: (category: string) => void
    toggleItem: (id: string) => void
    addItem: (item: {
        name: string
        category: GroceryCategory
        quantity: number
        unit: string
    }) => void
    deleteItem: (id: string) => void
    updateQuantity: (id: string, delta: number) => void
    clearCompleted: () => void
}

const INITIAL_ITEMS: GroceryItem[] = [
    {
        id: "1",
        name: "Oranganic Bananas",
        category: "Produce",
        quantity: 1,
        unit: "bunch",
        isCompleted: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Almond Milk",
        category: "Dairy",
        quantity: 2,
        unit: "cartons",
        isCompleted: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Sourdough Bread",
        category: "Bakery",
        quantity: 1,
        unit: "loaf",
        isCompleted: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: "4",
        name: "Chicken Breast",
        category: "Meat",
        quantity: 500,
        unit: "g",
        isCompleted: false,
        createdAt: new Date().toISOString()
    },
    {
        id: "5",
        name: "Rolled Oats",
        category: "Pantry",
        quantity: 1,
        unit: "pack",
        isCompleted: true,
        createdAt: new Date().toISOString(),
    },
]

export const useGroceryStore = create<GroceryState>((set) => ({
    items: INITIAL_ITEMS,
    selectedCategory: "All",
    selectedCateogry: "All",

    setSelectedCategory: (category) => set({ selectedCategory: category, selectedCateogry: category }),
    setSelectedCateogry: (category) => set({ selectedCategory: category, selectedCateogry: category }),

    toggleItem: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
            ),
        })),

    addItem: (item) =>
        set((state) => ({
            items: [
                {
                    ...item,
                    id: Date.now().toString(),
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
            items: state.items.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            ),
        })),

    clearCompleted: () =>
        set((state) => ({
            items: state.items.filter((item) => !item.isCompleted),
        })),
}))
