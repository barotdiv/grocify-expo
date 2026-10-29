import { CategoryFilter } from "@/components/CategoryFilter"
import { GroceryItemCard } from "@/components/GroceryItemCard"
import { Ionicons } from "@expo/vector-icons"
import { useMemo } from "react"
import { FlatList, Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useGroceryStore } from "@/store/useGroceryStore"

export default function GrocereisScreen() {
    const {
        items,
        selectedCategory,
        setSelectedCategory,
        toggleItem,
        deleteItem,
        updateQuantity,
        clearCompleted,
    } = useGroceryStore()

    const filteredItems = useMemo(() => {
        if (selectedCategory === "All") return items
        return items.filter((item) => item.category === selectedCategory)
    }, [items, selectedCategory])

    const completedCount = items.filter((i) => i.isCompleted).length

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-5 py-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
                <View>
                    <Text className="text-2xl font-bold text-gray-900">Grocify</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">
                        {items.length === 0 ? "Your list is empty" : `${completedCount} of ${items.length} items completed`}
                    </Text>
                </View>
                {completedCount > 0 && (
                    <Pressable onPress={clearCompleted} className="bg-red-50 px-3 py-1.5 rounded-full flex-row items-center">
                        <Ionicons name="trash-outline" size={14} color="#dc2626" />
                        <Text className="text-xs font-semibold text-red-600 ml-1">Clear Done</Text>
                    </Pressable>
                )}
            </View>
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <GroceryItemCard
                        item={item}
                        onToggle={() => toggleItem(item.id)}
                        onDelete={() => deleteItem(item.id)}
                        onUpdateQty={(delta) => updateQuantity(item.id, delta)}
                    />
                )}
            />
        </SafeAreaView>
    )
}
