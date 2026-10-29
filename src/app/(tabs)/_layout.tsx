import { useAuth } from "@clerk/expo"
import { Ionicons } from "@expo/vector-icons"
import { Redirect, Tabs } from "expo-router"
import { ActivityIndicator, View } from "react-native"

export default function TabsLayout() {
    const { isSignedIn, isLoaded } = useAuth()
    if (!isLoaded) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                <ActivityIndicator size="large" color="#0284c7" />
            </View>
        )
    }
    if (!isSignedIn) {
        return <Redirect href="/sign-in" />
    }
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#0284c7",
            tabBarInactiveTintColor: "#9ca3af",
            tabBarStyle: {
                backgroundColor: "#ffffff",
                borderTopWidth: 1,
                borderTopColor: "#f3f4f6",
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "600",
            },
        }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Groceries",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "cart" : "cart-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="planner"
                options={{
                    title: "Planner",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "calendar" : "calendar-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Insights"
                options={{
                    title: "Insights",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "pie-chart" : "pie-chart-outline"}
                            size={24}
                            color={color}
                        />
                    )
                }}
            />
        </Tabs>
    )
} 