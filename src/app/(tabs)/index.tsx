import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function GrocereisScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                <View>
                    <Text className="text-2xl font-bold text-gray-900">Grocify</Text>
                    <Text className="text-sm text-gray-500">Your shopping list</Text>
                </View>
                <Pressable className="bg-sky-50 px-3 py-2 rounded-full flex-row items-center">
                    <Ionicons name="sparkles" size={16} color="#0284c7" />
                    <Text className="text-xs font-semibold text-sky-600 ml-1">Organize</Text>
                </Pressable>
            </View>
            <View className="flex-1 items-center justify-center px-6">
                <View className="w-16 h-16 rounded-full bg-sky-100 items-center justify-center mb-4">
                    <Ionicons name="basket-outline" size={32} color="#0284c7" />
                </View>
                <Text className="text-lg font-bold text-gray-800">No items yet</Text>
                <Text className="text-sm text-gray-500 text-center mt-1">
                    Switch to the Planner tab to add items to your grocery list.
                </Text>
            </View>
        </SafeAreaView>
    )
}