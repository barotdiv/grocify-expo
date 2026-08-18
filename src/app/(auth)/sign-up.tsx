import useSocialAuth from "@/hooks/useSocialAuth";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();

  const isGoogleClicked = loadingStrategy === "oauth_google";
  const isAppleClicked = loadingStrategy === "oauth_apple";
  const isGitHubClicked = loadingStrategy === "oauth_github";

  const isLoading = isAppleClicked || isGitHubClicked || isGoogleClicked;

  return (
    <SafeAreaView className="flex-1 bg-primary dark:bg-secondary" edges={["top"]}>
      {/* decorative elements */}
      <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40" />
      <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/70 dark:bg-background/35" />

      <View className="px-6 pt-4">
        <Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground uppercase font-mono dark:text-foreground">
          Grocify
        </Text>

        <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground/75">
          Join us today & transform your grocery shopping.
        </Text>

        <View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
          <Image
            source={require("../../../assets/images/logo-glow.png")}
            style={{ width: "100%", height: 260 }}
            contentFit="contain"
          />
        </View>
      </View>

      <View className="mt-6 flex-1 rounded-t-[36px] bg-card px-6 pb-8 pt-6">
        <View className="self-center rounded-full bg-secondary px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
            Create Account
          </Text>
        </View>

        <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          Sign up with your preferred social account to start planning your groceries effortlessly.
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
              <FontAwesome name="google" size={20} color="#EA4335" />
            </View>

            <Text className="ml-3 flex-1 text-lg font-semibold text-card-foreground">
              {isGoogleClicked ? "Creating Account with Google..." : "Sign Up with Google"}
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
              {isGitHubClicked ? "Creating Account with GitHub..." : "Sign Up with GitHub"}
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
              {isAppleClicked ? "Creating Account with Apple..." : "Sign Up with Apple"}
            </Text>
            <FontAwesome name="angle-right" size={18} color="#5f6e66" />
          </Pressable>
        </View>

        <View className="mt-4 flex-row justify-center">
          <Text className="text-sm text-muted-foreground">Already have an account? </Text>
          <Link href="./sign-in" className="text-sm font-bold text-primary">
            Sign In
          </Link>
        </View>

        <Text className="mt-3 text-center text-xs leading-5 text-muted-foreground">
          By signing up, you agree to our Terms and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}
