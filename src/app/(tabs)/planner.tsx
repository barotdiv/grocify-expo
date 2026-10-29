import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function PlannerScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-900">Planner</Text>
                <Text className="text-sm text-gray-500">Add & organize groceries</Text>
            </View>
            <View className="flex-1 items-center justify-center px-6">
                <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
                    <Ionicons name="add-circle-outline" size={32} color="#59669" />
                </View>
                <Text className="text-lg font-bold text-gray-800">Add Item Form</Text>
                <Text className="text-sm text-gray-500 text-center mt-1">
                    We will build the category selector, name input, and quantity counter here in Phase 3.
                </Text>
            </View>
        </SafeAreaView>
    )
}