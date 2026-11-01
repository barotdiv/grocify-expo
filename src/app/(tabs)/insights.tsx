import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useClerk, useUser } from "@clerk/expo";
import { useGroceryStore } from "@/store/useGroceryStore";

export default function InsightsScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { items } = useGroceryStore();

  // Compute analytics
  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.isCompleted).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const highPriorityPending = items.filter(
      (i) => !i.isCompleted && i.priority === "high"
    ).length;

    // Items grouped by category
    const categoryCount: Record<string, number> = {};
    items.forEach((item) => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

    return {
      total,
      completed,
      pending,
      completionRate,
      highPriorityPending,
      categoryCount,
    };
  }, [items]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-background">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-extrabold text-gray-900 dark:text-foreground">
            Insights & Analytics
          </Text>
          <Text className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
            Your shopping patterns and overview
          </Text>
        </View>

        {/* 1. Metric Cards Grid */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View className="flex-1 min-w-[45%] bg-white dark:bg-card p-4 rounded-2xl border border-gray-100 dark:border-border">
            <Text className="text-xs text-gray-500 dark:text-muted-foreground">Total Items</Text>
            <Text className="text-2xl font-black text-gray-900 dark:text-foreground mt-1">
              {stats.total}
            </Text>
          </View>
          <View className="flex-1 min-w-[45%] bg-white dark:bg-card p-4 rounded-2xl border border-gray-100 dark:border-border">
            <Text className="text-xs text-gray-500 dark:text-muted-foreground">Completed</Text>
            <Text className="text-2xl font-black text-emerald-600 mt-1">
              {stats.completed}
            </Text>
          </View>
          <View className="flex-1 min-w-[45%] bg-white dark:bg-card p-4 rounded-2xl border border-gray-100 dark:border-border">
            <Text className="text-xs text-gray-500 dark:text-muted-foreground">Pending</Text>
            <Text className="text-2xl font-black text-amber-600 mt-1">
              {stats.pending}
            </Text>
          </View>
          <View className="flex-1 min-w-[45%] bg-white dark:bg-card p-4 rounded-2xl border border-gray-100 dark:border-border">
            <Text className="text-xs text-gray-500 dark:text-muted-foreground">Completion Rate</Text>
            <Text className="text-2xl font-black text-sky-600 mt-1">
              {stats.completionRate}%
            </Text>
          </View>
        </View>

        {/* 2. High Priority Alert Banner (if any) */}
        {stats.highPriorityPending > 0 && (
          <View className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-4 rounded-2xl flex-row items-center mb-6">
            <Ionicons name="alert-circle" size={24} color="#dc2626" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-red-800 dark:text-red-300">
                {stats.highPriorityPending} High-Priority Item(s) Left
              </Text>
              <Text className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                Don't forget to grab your essential groceries first!
              </Text>
            </View>
          </View>
        )}

        {/* 3. Category Breakdown */}
        <View className="bg-white dark:bg-card p-5 rounded-2xl border border-gray-100 dark:border-border mb-6">
          <Text className="text-sm font-bold text-gray-900 dark:text-foreground mb-4">
            Items by Category
          </Text>
          {Object.keys(stats.categoryCount).length === 0 ? (
            <Text className="text-xs text-gray-400">No items added yet.</Text>
          ) : (
            Object.entries(stats.categoryCount).map(([cat, count]) => {
              const percentage = Math.round((count / stats.total) * 100);
              return (
                <View key={cat} className="mb-3">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {cat}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {count} ({percentage}%)
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-100 dark:bg-muted rounded-full overflow-hidden">
                    <View
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* 4. Profile & Sign Out Card */}
        <View className="bg-white dark:bg-card p-4 rounded-2xl border border-gray-100 dark:border-border flex-row items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 items-center justify-center mr-3">
            <Ionicons name="person" size={22} color="#16a34a" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 dark:text-foreground">
              {user?.fullName || "Grocery Shopper"}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-muted-foreground">
              {user?.emailAddresses?.[0]?.emailAddress}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => signOut()}
          className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 py-3.5 rounded-xl flex-row items-center justify-center active:opacity-70"
        >
          <Ionicons name="log-out-outline" size={18} color="#dc2626" />
          <Text className="text-red-600 dark:text-red-400 font-bold text-sm ml-2">
            Sign Out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
