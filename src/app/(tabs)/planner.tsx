import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGroceryStore } from "@/store/useGroceryStore";
import { CATEGORIES, GroceryCategory, Priority } from "@/types/grocery";

const UNITS = ["pcs", "kg", "g", "pack", "loaf", "cartons", "bottle"];
const PRIORITIES: { label: string; value: Priority; color: string }[] = [
  { label: "Low", value: "low", color: "#16a34a" },
  { label: "Medium", value: "medium", color: "#d97706" },
  { label: "High", value: "high", color: "#dc2626" },
];

export default function PlannerScreen() {
  const router = useRouter();
  const { addItem } = useGroceryStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<GroceryCategory>("Produce");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter an item name.");
      return;
    }

    addItem({
      name: name.trim(),
      category,
      quantity,
      unit,
      priority,
    });

    // Reset form
    setName("");
    setQuantity(1);
    setUnit("pcs");
    setPriority("medium");

    // Navigate back to grocery list tab
    router.push("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-extrabold text-gray-900 dark:text-foreground">
              Add New Item
            </Text>
            <Text className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
              Plan and organize items for your next grocery run
            </Text>
          </View>

          {/* 1. Item Name Input */}
          <View className="mb-5">
            <Text className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Item Name *
            </Text>
            <View className="flex-row items-center bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl px-4 py-3">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Organic Bananas"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base text-gray-900 dark:text-foreground"
              />
              {name.length > 0 && (
                <Pressable onPress={() => setName("")}>
                  <Ionicons name="close-circle" size={18} color="#9ca3af" />
                </Pressable>
              )}
            </View>
          </View>

          {/* 2. Category Selector */}
          <View className="mb-5">
            <Text className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <Pressable
                    key={cat.name}
                    onPress={() => setCategory(cat.name)}
                    className={`px-3.5 py-2 rounded-xl flex-row items-center mr-2 border ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600"
                        : "bg-white dark:bg-card border-gray-200 dark:border-border"
                    }`}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={16}
                      color={isSelected ? "#ffffff" : "#4b5563"}
                    />
                    <Text
                      className={`text-xs font-semibold ml-1.5 ${
                        isSelected ? "text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 3. Quantity & Unit */}
          <View className="mb-5">
            <Text className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Quantity & Unit
            </Text>
            <View className="flex-row items-center justify-between bg-white dark:bg-card p-3 rounded-xl border border-gray-200 dark:border-border mb-3">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Amount
              </Text>
              <View className="flex-row items-center">
                <Pressable
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-muted items-center justify-center active:opacity-60"
                >
                  <Ionicons name="remove" size={16} color="#374151" />
                </Pressable>
                <Text className="mx-4 text-base font-bold text-gray-900 dark:text-foreground min-w-[20px] text-center">
                  {quantity}
                </Text>
                <Pressable
                  onPress={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-muted items-center justify-center active:opacity-60"
                >
                  <Ionicons name="add" size={16} color="#374151" />
                </Pressable>
              </View>
            </View>

            {/* Units list */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {UNITS.map((u) => {
                const isSelected = unit === u;
                return (
                  <Pressable
                    key={u}
                    onPress={() => setUnit(u)}
                    className={`px-3 py-1.5 rounded-lg mr-2 border ${
                      isSelected
                        ? "bg-gray-900 dark:bg-white border-transparent"
                        : "bg-white dark:bg-card border-gray-200 dark:border-border"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isSelected
                          ? "text-white dark:text-black"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {u}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* 4. Priority Selector */}
          <View className="mb-8">
            <Text className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Priority
            </Text>
            <View className="flex-row gap-3">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.value;
                return (
                  <Pressable
                    key={p.value}
                    onPress={() => setPriority(p.value)}
                    style={{
                      borderColor: isSelected ? p.color : undefined,
                    }}
                    className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${
                      isSelected
                        ? "bg-white dark:bg-card border-2"
                        : "bg-white dark:bg-card border-gray-200 dark:border-border"
                    }`}
                  >
                    <Text
                      style={{ color: isSelected ? p.color : "#6b7280" }}
                      className="text-xs font-bold"
                    >
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSave}
            className="bg-emerald-600 py-4 rounded-2xl items-center shadow-sm active:opacity-80 flex-row justify-center"
          >
            <Ionicons name="add-circle" size={20} color="#ffffff" />
            <Text className="text-white font-bold text-base ml-2">Add to Groceries</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
