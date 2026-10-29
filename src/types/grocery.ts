export type GroceryCategory =
    | "Produce"
    | "Dairy"
    | "Bakery"
    | "Meat"
    | "Pantry"
    | "Snacks"
    | "Beverages"
    | "Other"
export interface GroceryItem {
    id: string
    name: string
    category: GroceryCategory
    quantity: number
    unit: string
    isCompleted: boolean
    createdAt: string
}

export const CATEGORIES: { name: GroceryCategory; icon: string; color: string }[] = [
    { name: "Produce", icon: "nutrition-outline", color: "#16a34a" },
    { name: "Dairy", icon: "water-outline", color: "#0284c7" },
    { name: "Bakery", icon: "restaurant-outline", color: "#d97706" },
    { name: "Meat", icon: "flame-outline", color: "#dc2626" },
    { name: "Pantry", icon: "cube-outline", color: "#7c3aed" },
    { name: "Snacks", icon: "pizza-outline", color: "#ea580c" },
    { name: "Beverages", icon: "beer-outline", color: "#0891b2" },
    { name: "Other", icon: "ellipsis-horizontal-outline", color: "#6b7280" },
]
