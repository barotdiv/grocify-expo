import { useOAuth } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import React from "react";

WebBrowser.maybeCompleteAuthSession();

export type SocialStrategy = "oauth_google" | "oauth_github" | "oauth_apple";

export default function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = React.useState<SocialStrategy | null>(null);

  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const githubOAuth = useOAuth({ strategy: "oauth_github" });
  const appleOAuth = useOAuth({ strategy: "oauth_apple" });

  const handleSocialAuth = async (strategy: SocialStrategy) => {
    try {
      setLoadingStrategy(strategy);
      let oauth = googleOAuth;
      if (strategy === "oauth_github") oauth = githubOAuth;
      if (strategy === "oauth_apple") oauth = appleOAuth;

      const { startOAuthFlow } = oauth;
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error:", err);
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
}
