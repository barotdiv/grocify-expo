export type GroceryCategory =
    | "Produce"
    | "Dairy"
    | "Bakery"
    | "Meat"
    | "Pantry"
    | "Snacks"
    | "Beverages"
    | "Other"

export type Priority = "low" | "medium" | "high"

export interface GroceryItem {
    id: string
    name: string
    category: GroceryCategory
    quantity: number
    unit: string
    priority?: Priority
    isCompleted: boolean
    createdAt: string
}

export const CATEGORIES: { name: GroceryCategory; icon: string }[] = [
    { name: "Produce", icon: "nutrition-outline" },
    { name: "Dairy", icon: "water-outline" },
    { name: "Bakery", icon: "restaurant-outline" },
    { name: "Meat", icon: "flame-outline" },
    { name: "Pantry", icon: "cube-outline" },
    { name: "Snacks", icon: "pizza-outline" },
    { name: "Beverages", icon: "beer-outline" },
    { name: "Other", icon: "ellipsis-horizontal-outline" },
]
