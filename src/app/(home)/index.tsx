import { useClerk, useUser } from "@clerk/expo";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  completed: boolean;
  price?: number;
}

const CATEGORIES = [
  { id: "all", name: "All", icon: "view-grid" },
  { id: "produce", name: "Produce", icon: "food-apple" },
  { id: "dairy", name: "Dairy & Eggs", icon: "egg" },
  { id: "pantry", name: "Pantry", icon: "barley" },
  { id: "bakery", name: "Bakery", icon: "bread-slice" },
  { id: "beverages", name: "Beverages", icon: "glass-cocktail" },
];

const INITIAL_GROCERIES: GroceryItem[] = [
  { id: "1", name: "Organic Avocados", category: "produce", quantity: 3, completed: false, price: 4.99 },
  { id: "2", name: "Whole Almond Milk", category: "dairy", quantity: 1, completed: false, price: 3.49 },
  { id: "3", name: "Sourdough Bread", category: "bakery", quantity: 1, completed: true, price: 4.29 },
  { id: "4", name: "Greek Yogurt (Vanilla)", category: "dairy", quantity: 2, completed: false, price: 5.99 },
  { id: "5", name: "Extra Virgin Olive Oil", category: "pantry", quantity: 1, completed: false, price: 9.99 },
  { id: "6", name: "Sparkling Water 6-Pack", category: "beverages", quantity: 2, completed: true, price: 6.49 },
];

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [items, setItems] = useState<GroceryItem[]>(INITIAL_GROCERIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("produce");

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeItems = filteredItems.filter((item) => !item.completed);
  const completedItems = filteredItems.filter((item) => item.completed);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: 1,
      completed: false,
      price: 2.99,
    };
    setItems((prev) => [newItem, ...prev]);
    setNewItemName("");
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const totalCost = items.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="bg-primary px-6 pb-6 pt-2 dark:bg-slate-900 rounded-b-3xl">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="h-12 w-12 rounded-full border-2 border-white/40"
                />
              ) : (
                <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20 border-2 border-white/40">
                  <Text className="text-xl font-bold text-white">
                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
                  </Text>
                </View>
              )}
              <View>
                <Text className="text-xs font-semibold text-white/80">Welcome Back,</Text>
                <Text className="text-xl font-extrabold text-white">
                  {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Shopper"} 👋
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => signOut()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
            >
              <Ionicons name="log-out-outline" size={22} color="#fff" />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View className="mt-5 flex-row items-center rounded-2xl bg-white/15 px-4 py-3 border border-white/20">
            <Ionicons name="search" size={20} color="#fff" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search groceries, lists, categories..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              className="ml-3 flex-1 text-base text-white"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.7)" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View className="px-5 pt-5">
          {/* Summary Dashboard Cards */}
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <View className="h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
                <Ionicons name="basket-outline" size={20} color="#059669" />
              </View>
              <Text className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
                {items.filter((i) => !i.completed).length}
              </Text>
              <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">Items Pending</Text>
            </View>

            <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <View className="h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
                <Ionicons name="checkmark-done-circle-outline" size={20} color="#2563eb" />
              </View>
              <Text className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
                {items.filter((i) => i.completed).length}
              </Text>
              <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">Items Bought</Text>
            </View>

            <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <View className="h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950">
                <Ionicons name="wallet-outline" size={20} color="#9333ea" />
              </View>
              <Text className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
                ${totalCost.toFixed(2)}
              </Text>
              <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">Est. Total</Text>
            </View>
          </View>

          {/* Quick Add Item Bar */}
          <View className="mt-5 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <Text className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Add New Grocery Item
            </Text>
            <View className="mt-3 flex-row items-center gap-2">
              <TextInput
                value={newItemName}
                onChangeText={setNewItemName}
                placeholder="e.g. Fresh Organic Tomatoes"
                placeholderTextColor="#94a3b8"
                className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                onSubmitEditing={addItem}
              />
              <Pressable
                onPress={addItem}
                className="h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 active:bg-emerald-700"
              >
                <Ionicons name="add" size={24} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Categories Selector */}
          <View className="mt-5">
            <Text className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
              Categories
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    className={`mr-2 flex-row items-center rounded-full px-4 py-2 border ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600"
                        : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                    }`}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={18}
                      color={isSelected ? "#fff" : "#64748b"}
                    />
                    <Text
                      className={`ml-2 text-xs font-semibold ${
                        isSelected ? "text-white" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Active Grocery Items List */}
          <View className="mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-bold text-slate-900 dark:text-slate-100">
                To Buy ({activeItems.length})
              </Text>
              {activeItems.length > 0 && (
                <Text className="text-xs text-slate-500">Tap item to check off</Text>
              )}
            </View>

            {activeItems.length === 0 ? (
              <View className="items-center justify-center rounded-2xl bg-white p-8 border border-dashed border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <Ionicons name="cart-outline" size={40} color="#cbd5e1" />
                <Text className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  No pending grocery items
                </Text>
                <Text className="text-xs text-slate-400 mt-1">Add items above or clear filters</Text>
              </View>
            ) : (
              activeItems.map((item) => (
                <View
                  key={item.id}
                  className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800"
                >
                  <Pressable
                    onPress={() => toggleItem(item.id)}
                    className="flex-1 flex-row items-center gap-3"
                  >
                    <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {item.name}
                      </Text>
                      <Text className="text-xs capitalize text-slate-400">
                        {item.category} • ${(item.price || 0).toFixed(2)} each
                      </Text>
                    </View>
                  </Pressable>

                  <View className="flex-row items-center gap-2">
                    <View className="flex-row items-center rounded-xl bg-slate-100 dark:bg-slate-800 px-2 py-1">
                      <Pressable onPress={() => updateQuantity(item.id, -1)} className="px-1">
                        <Ionicons name="remove" size={16} color="#64748b" />
                      </Pressable>
                      <Text className="px-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.quantity}
                      </Text>
                      <Pressable onPress={() => updateQuantity(item.id, 1)} className="px-1">
                        <Ionicons name="add" size={16} color="#64748b" />
                      </Pressable>
                    </View>

                    <Pressable
                      onPress={() => deleteItem(item.id)}
                      className="p-1 active:opacity-60"
                    >
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Completed Items Section */}
          {completedItems.length > 0 && (
            <View className="mt-6 mb-8">
              <Text className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
                Completed ({completedItems.length})
              </Text>
              {completedItems.map((item) => (
                <View
                  key={item.id}
                  className="mb-2 flex-row items-center justify-between rounded-2xl bg-slate-100/60 p-4 border border-slate-200/50 dark:bg-slate-900/40 dark:border-slate-800"
                >
                  <Pressable
                    onPress={() => toggleItem(item.id)}
                    className="flex-1 flex-row items-center gap-3"
                  >
                    <View className="h-6 w-6 items-center justify-center rounded-full bg-emerald-600">
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                    <Text className="text-sm font-semibold text-slate-400 line-through">
                      {item.name} ({item.quantity})
                    </Text>
                  </Pressable>

                  <Pressable onPress={() => deleteItem(item.id)} className="p-1">
                    <Ionicons name="trash-outline" size={16} color="#94a3b8" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
