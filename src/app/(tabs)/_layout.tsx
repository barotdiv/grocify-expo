import { useAuth } from "@clerk/expo"
import { Ionicons } from "@expo/vector-icons"
import { Redirect, Tabs } from "expo-router"
import { ActivityIndicator, View } from "react-native"

export default function TabsLayout() {
    const { isSignedIn, isLoaded } = useAuth()
    if (!isLoaded) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="#16a34a" />
            </View>
        )
    }
    if (!isSignedIn) {
        return <Redirect href="/sign-in" />
    }
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#16a34a",
            tabBarInactiveTintColor: "#9ca3af",
            tabBarStyle: {
                backgroundColor: "#ffffff",
                borderTopWidth: 1,
                borderTopColor: "#f0fdf4",
                height: 64,
                paddingBottom: 10,
                paddingTop: 8,
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
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
                            name={focused ? "add-circle" : "add-circle-outline"}
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