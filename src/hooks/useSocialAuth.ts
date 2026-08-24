import { useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect } from "react";
import { Platform } from "react-native";

// Complete auth session if redirected back to web
WebBrowser.maybeCompleteAuthSession();

export type SocialStrategy = "oauth_google" | "oauth_github" | "oauth_apple";

export default function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = React.useState<SocialStrategy | null>(null);
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  // Warm up the browser on Android for faster loading
  useEffect(() => {
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);

  const handleSocialAuth = useCallback(
    async (strategy: SocialStrategy) => {
      try {
        setLoadingStrategy(strategy);

        // Build the redirect URL using the app's custom scheme
        const redirectUrl = Linking.createURL("/", { scheme: "grocify" });

        const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
          strategy,
          redirectUrl,
        });

        if (createdSessionId) {
          if (setActive) {
            await setActive({ session: createdSessionId });
          }
          router.replace("/");
        } else {
          console.log("OAuth response:", { signIn, signUp });
        }
      } catch (err: any) {
        console.error("OAuth error:", JSON.stringify(err, null, 2) || err);
      } finally {
        setLoadingStrategy(null);
      }
    },
    [startSSOFlow, router]
  );

  return { handleSocialAuth, loadingStrategy };
}
