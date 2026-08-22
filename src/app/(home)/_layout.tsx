import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

export default function Layout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return null;
    }
    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "index",
                    headerTitle: "index",
                }}
            />
        </Stack>
    );
}