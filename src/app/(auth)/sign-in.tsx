import useSocialAuth from "@/hooks/useSocialAuth";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthImage from "../../../assets/images/splash-icon.png";

import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export default function SignInScreen() {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();

  const isGoogleClicked = loadingStrategy === "oauth_google";
  const isAppleClicked = loadingStrategy === "oauth_apple";
  const isGitHubClicked = loadingStrategy === "oauth_github";

  const isLoading = isAppleClicked || isGitHubClicked || isGoogleClicked;

  return (
    <SafeAreaView
      className="flex-1 bg-primary dark:bg-secondary"
      edges={["top"]}
    >
      {/* decorative elements */}
      <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40" />
      <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/70 dark:bg-background/35" />

      <View className="px-6 pt-4">
        <Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground uppercase font-mono dark:text-foreground">
          Grocify
        </Text>

        <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground/75">
          Plan smarter. Shop happier.
        </Text>

        <View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
          <Image
            source={AuthImage}
            style={{ width: "100%", height: 300 }}
            contentFit="contain"
          />
        </View>
      </View>

      <View className="mt-8 flex-1 rounded-t-[36px] bg-card px-6 pb-8 pt-6">
        <View className="self-center rounded-full bg-secondary px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
            Welcome Back
          </Text>
        </View>

        <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          Choose a social provider and jump right into your personalized grocery
          experience.
        </Text>

        <View className="mt-6">
          <Pressable
            className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${
              isLoading ? "opacity-70" : ""
            }`}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_google")}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <FontAwesome name="google" size={20} color="#4285F4" />
            </View>

            <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
              {isGoogleClicked
                ? "Connecting Google..."
                : "Continue with Google"}
            </Text>

            <FontAwesome name="angle-right" size={18} color="#5f6e66" />
          </Pressable>

          <Pressable
            className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${
              isLoading ? "opacity-70" : ""
            }`}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_github")}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <FontAwesome name="github" size={24} color="#111" />
            </View>
            <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
              {isGitHubClicked
                ? "Connecting GitHub..."
                : "Continue with GitHub"}
            </Text>
            <FontAwesome name="angle-right" size={18} color="#5f6e66" />
          </Pressable>

          <Pressable
            className={`mb-3 h-14 flex-row items-center rounded-2xl border border-foreground bg-foreground px-4 active:opacity-90 ${
              isLoading ? "opacity-70" : ""
            }`}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_apple")}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <FontAwesome6 name="apple" size={22} color="#111" />
            </View>
            <Text className="ml-3 flex-1 text-lg font-semibold text-background">
              {isAppleClicked ? "Connecting Apple..." : "Continue with Apple"}
            </Text>
            <FontAwesome name="angle-right" size={18} color="#5f6e66" />
          </Pressable>
        </View>

        <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground">
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}
