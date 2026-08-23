import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useSignUp } from "@clerk/expo/legacy";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded || !signUp) return;
    setLoading(true);
    setErrorMsg("");

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const msg =
        err?.errors?.[0]?.message ||
        err?.message ||
        "An error occurred during sign up.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !signUp) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        setErrorMsg("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const msg =
        err?.errors?.[0]?.message ||
        err?.message ||
        "An error occurred during verification.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isSignedIn) {
    return null;
  }

  // Verification step view
  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => setPendingVerification(false)}
          >
            <Ionicons name="chevron-back" size={18} color="#ffffff" />
            <Text style={styles.backButtonText}>back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>verify email</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Verify your account</Text>
            <Text style={styles.subtitle}>
              Enter the verification code sent to your email
            </Text>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={code}
                placeholder="Enter verification code"
                placeholderTextColor="#6b7280"
                onChangeText={(text) => {
                  setCode(text);
                  if (errorMsg) setErrorMsg("");
                }}
                keyboardType="numeric"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                (!code.trim() || loading) && styles.primaryButtonDisabled,
                pressed && { opacity: 0.85 },
              ]}
              onPress={onVerifyPress}
              disabled={!code.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#121214" />
              ) : (
                <Text
                  style={[
                    styles.primaryButtonText,
                    !code.trim() && styles.primaryButtonTextDisabled,
                  ]}
                >
                  Verify ›
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Initial Sign Up view
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

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#6b7280"
              onChangeText={(text) => {
                setEmailAddress(text);
                if (errorMsg) setErrorMsg("");
              }}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#6b7280"
              secureTextEntry={true}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMsg) setErrorMsg("");
              }}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              (!emailAddress.trim() || !password || loading) &&
                styles.primaryButtonDisabled,
              pressed && { opacity: 0.85 },
            ]}
            onPress={onSignUpPress}
            disabled={!emailAddress.trim() || !password || loading}
          >
            {loading ? (
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