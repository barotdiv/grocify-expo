import { useAuth } from "@clerk/expo";
import { useSignUp } from "@clerk/expo/legacy";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import useSocialAuth from "../../hooks/useSocialAuth";

function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <Path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <Path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <Path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </Svg>
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
                pressed && styles.primaryButtonPressed,
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
              pressed && styles.primaryButtonPressed,
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

          {/* 3 Separated Social Auth Boxes in Side-by-Side Position */}
          <View style={styles.socialRow}>
            {/* Apple Box */}
            <Pressable
              style={({ pressed }) => [
                styles.socialBox,
                loadingStrategy === "oauth_apple" && styles.socialBoxActive,
                pressed && styles.socialBoxPressed,
              ]}
              onPress={() => handleSocialAuth("oauth_apple")}
              disabled={!!loadingStrategy}
              accessibilityLabel="Sign up with Apple"
            >
              {loadingStrategy === "oauth_apple" ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="logo-apple" size={22} color="#ffffff" />
              )}
            </Pressable>

            {/* GitHub Box */}
            <Pressable
              style={({ pressed }) => [
                styles.socialBox,
                loadingStrategy === "oauth_github" && styles.socialBoxActive,
                pressed && styles.socialBoxPressed,
              ]}
              onPress={() => handleSocialAuth("oauth_github")}
              disabled={!!loadingStrategy}
              accessibilityLabel="Sign up with GitHub"
            >
              {loadingStrategy === "oauth_github" ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="logo-github" size={22} color="#ffffff" />
              )}
            </Pressable>

            {/* Google Box */}
            <Pressable
              style={({ pressed }) => [
                styles.socialBox,
                loadingStrategy === "oauth_google" && styles.socialBoxActive,
                pressed && styles.socialBoxPressed,
              ]}
              onPress={() => handleSocialAuth("oauth_google")}
              disabled={!!loadingStrategy}
              accessibilityLabel="Sign up with Google"
            >
              {loadingStrategy === "oauth_google" ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <GoogleIcon size={22} />
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
              <Pressable style={({ pressed }) => [styles.linkButton, pressed && { opacity: 0.8 }]}>
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
    backgroundColor: "#121214",
  },
  header: {
    height: 48,
    backgroundColor: "#121214",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e22",
    borderWidth: 1,
    borderColor: "#33333b",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#ffffff",
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
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
    fontSize: 24,
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
    paddingVertical: 14,
    fontSize: 15,
    color: "#ffffff",
  },
  primaryButton: {
    backgroundColor: "#c8c8cc",
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: "#b5b5b8",
    opacity: 0.65,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#52525b",
  },
  primaryButtonTextDisabled: {
    color: "#71717a",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#27272a",
  },
  dividerText: {
    color: "#71717a",
    fontSize: 13,
    paddingHorizontal: 12,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 28,
  },
  socialBox: {
    flex: 1,
    height: 52,
    backgroundColor: "#161618",
    borderWidth: 1,
    borderColor: "#2e2e34",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  socialBoxActive: {
    borderColor: "#60a5fa",
    backgroundColor: "#27272e",
  },
  socialBoxPressed: {
    opacity: 0.75,
    backgroundColor: "#222228",
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
  linkButton: {
    backgroundColor: "#1e1e22",
    borderWidth: 1,
    borderColor: "#38bdf8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 4,
  },
  signInLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#38bdf8",
  },
});