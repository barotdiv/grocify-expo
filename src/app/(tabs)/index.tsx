import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryFilter } from "../../components/CategoryFilter";
import { GroceryItemCard } from "../../components/GroceryItemCard";
import { useGroceryStore } from "../../store/useGroceryStore";

export default function GroceriesScreen() {
  const {
    items,
    selectedCategory,
    setSelectedCategory,
    toggleItem,
    deleteItem,
    updateQuantity,
    clearCompleted,
  } = useGroceryStore();

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const completedCount = items.filter((i) => i.isCompleted).length;

  return (
    <SafeAreaView className="flex-1 bg-[#f8faf8] dark:bg-background">
      {/* Header */}
      <View className="px-5 py-4 bg-white dark:bg-card border-b border-emerald-50 dark:border-border flex-row items-center justify-between">
        <View>
          <View className="flex-row items-center">
            <Ionicons name="leaf" size={22} color="#16a34a" />
            <Text className="text-2xl font-extrabold text-gray-900 dark:text-foreground ml-1.5 tracking-tight">
              Grocify
            </Text>
          </View>
          <Text className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
            {items.length === 0
              ? "Your list is empty"
              : `${completedCount} of ${items.length} items checked off`}
          </Text>
        </View>

        {completedCount > 0 && (
          <Pressable
            onPress={clearCompleted}
            className="bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-full flex-row items-center border border-red-100 dark:border-red-900"
          >
            <Ionicons name="trash-outline" size={13} color="#dc2626" />
            <Text className="text-xs font-semibold text-red-600 ml-1">
              Clear Done
            </Text>
          </Pressable>
        )}
      </View>

      {/* Filter Component */}
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* List Component */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <View className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 items-center justify-center mb-3">
              <Ionicons name="basket-outline" size={32} color="#16a34a" />
            </View>
            <Text className="text-base font-bold text-gray-800 dark:text-foreground">
              No items in this category
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              Switch to Planner to add items
            </Text>
          </View>
        }
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
  );
}