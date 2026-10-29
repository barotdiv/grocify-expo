import { useClerk, useUser } from "@clerk/expo"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function InsightsScreen() {
    const { user } = useUser()
    const { signOut } = useClerk()

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-900">Insight & Accout</Text>
                <Text className="text-sm text-gray-500">Shopping analytics and settings</Text>
            </View>
            <View className="p-6">
                <View className="bg-white p-4 rounded-2xl border-gray-100 shadow-sm mb-6 flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-sky-100 items-center justify-center mr-4">
                        <Ionicons name="person" size={24} color="#0284c7" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                            {user?.fullName || "Grocery Shopper"}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            {user?.emailAddresses?.[0]?.emailAddress}
                        </Text>
                    </View>
                </View>
                <Pressable
                    onPress={() => signOut()}
                    className="bg-red-50 border border-red-200 py-3 rounded-xl flex-row items-center justify-center"
                >
                    <Ionicons name="log-out-outline" size={20} color="#dc2626" />
                    <Text className="text-red-600 font-semibold ml-2">Sign Out</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}