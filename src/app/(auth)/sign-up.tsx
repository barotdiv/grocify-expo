import { Ionicons } from "@expo/vector-icons";
import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSocialAuth from "../../hooks/useSocialAuth";

function GoogleIcon() {
  return (
    <View style={styles.googleIconContainer}>
      <Ionicons name="logo-google" size={18} color="#4285F4" />
    </View>
  );
}

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    if (!signUp) return;
    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });
      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }
      await signUp.verifications.sendEmailCode();
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  const handleVerify = async () => {
    if (!signUp) return;
    try {
      await signUp.verifications.verifyEmailCode({
        code,
      });
      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl("/");
            if (typeof window !== "undefined" && url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.replace(url as Href);
            }
          },
        });
      } else {
        console.error("Sign-up attempt not complete:", signUp);
      }
    } catch (err) {
      console.error("Verify error:", err);
    }
  };

  if (signUp?.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp?.status === "missing_requirements" &&
    signUp.unverifiedFields?.includes("email_address") &&
    signUp.missingFields?.length === 0
  ) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <Link href="/sign-in" asChild>
            <Pressable style={styles.backButton}>
              <Ionicons name="chevron-back" size={18} color="#ffffff" />
              <Text style={styles.backButtonText}>sign-in</Text>
            </Pressable>
          </Link>
          <Text style={styles.headerTitle}>sign-up</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Verify your account</Text>
            <Text style={styles.subtitle}>
              Enter the verification code sent to your email
            </Text>

            {errors?.fields?.code && (
              <Text style={styles.errorText}>{errors.fields.code.message}</Text>
            )}
            {errors?.global && (
              <Text style={styles.errorText}>
                {errors.global.map((e) => e.message).join(", ")}
              </Text>
            )}

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={code}
                placeholder="Enter verification code"
                placeholderTextColor="#6b7280"
                onChangeText={(text) => setCode(text)}
                keyboardType="numeric"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                fetchStatus === "fetching" && styles.primaryButtonDisabled,
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleVerify}
              disabled={fetchStatus === "fetching"}
            >
              {fetchStatus === "fetching" ? (
                <ActivityIndicator color="#121214" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify ›</Text>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Link href="/sign-in" asChild>
          <Pressable style={styles.backButton}>
            <Ionicons name="chevron-back" size={18} color="#ffffff" />
            <Text style={styles.backButtonText}>sign-in</Text>
          </Pressable>
        </Link>
        <Text style={styles.headerTitle}>sign-up</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Welcome! Sign up to continue</Text>

          {errors?.fields?.emailAddress && (
            <Text style={styles.errorText}>
              {errors.fields.emailAddress.message}
            </Text>
          )}
          {errors?.fields?.password && (
            <Text style={styles.errorText}>
              {errors.fields.password.message}
            </Text>
          )}
          {errors?.global && (
            <Text style={styles.errorText}>
              {errors.global.map((e) => e.message).join(", ")}
            </Text>
          )}

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#6b7280"
              onChangeText={setEmailAddress}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#6b7280"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              (!emailAddress.trim() || !password || fetchStatus === "fetching") &&
                styles.primaryButtonDisabled,
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleSubmit}
            disabled={
              !emailAddress.trim() || !password || fetchStatus === "fetching"
            }
          >
            {fetchStatus === "fetching" ? (
              <ActivityIndicator color="#121214" />
            ) : (
              <Text
                style={[
                  styles.primaryButtonText,
                  (!emailAddress.trim() || !password) &&
                    styles.primaryButtonTextDisabled,
                ]}
              >
                Sign up ›
              </Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Auth Row */}
          <View style={styles.socialRow}>
            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                loadingStrategy === "oauth_apple" && styles.socialButtonActive,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => handleSocialAuth("oauth_apple")}
              disabled={!!loadingStrategy}
            >
              {loadingStrategy === "oauth_apple" ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="logo-apple" size={20} color="#ffffff" />
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                loadingStrategy === "oauth_github" && styles.socialButtonActive,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => handleSocialAuth("oauth_github")}
              disabled={!!loadingStrategy}
            >
              {loadingStrategy === "oauth_github" ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="logo-github" size={20} color="#ffffff" />
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                loadingStrategy === "oauth_google" && styles.socialButtonActive,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => handleSocialAuth("oauth_google")}
              disabled={!!loadingStrategy}
            >
              {loadingStrategy === "oauth_google" ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <GoogleIcon />
              )}
            </Pressable>
          </View>

          {/* Secured by Clerk */}
          <View style={styles.footerSecured}>
            <Text style={styles.securedText}>Secured by </Text>
            <Text style={styles.clerkLogoDot}>● </Text>
            <Text style={styles.clerkText}>clerk</Text>
          </View>

          {/* Already have an account link */}
          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Link href="/sign-in" asChild>
              <Pressable>
                <Text style={styles.signInLink}>Sign in</Text>
              </Pressable>
            </Link>
          </View>

          {/* Required for bot detection / captcha challenges */}
          <View nativeID="clerk-captcha" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 44,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121214",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#ffffff",
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  container: {
    flex: 1,
    backgroundColor: "#121214",
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  card: {
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 28,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 14,
  },
  inputGroup: {
    gap: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1e1e22",
    borderWidth: 1,
    borderColor: "#2d2d34",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#ffffff",
  },
  primaryButton: {
    backgroundColor: "#e1e1e6",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: "#333338",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#121214",
  },
  primaryButtonTextDisabled: {
    color: "#71717a",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#27272a",
  },
  dividerText: {
    color: "#71717a",
    fontSize: 13,
    paddingHorizontal: 14,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#1e1e22",
    borderWidth: 1,
    borderColor: "#2d2d34",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonActive: {
    borderColor: "#60a5fa",
  },
  googleIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  footerSecured: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  securedText: {
    fontSize: 12,
    color: "#71717a",
  },
  clerkLogoDot: {
    fontSize: 8,
    color: "#6366f1",
  },
  clerkText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9ca3af",
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    fontSize: 14,
    color: "#71717a",
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#38bdf8",
  },
});