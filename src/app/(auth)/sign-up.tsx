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

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
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
              <Ionicons name="chevron-back" size={20} color="#000000" />
              <Text style={styles.backButtonText}>sign-in</Text>
            </Pressable>
          </Link>
          <Text style={styles.headerTitle}>sign-up</Text>
        </View>
        <View style={styles.container}>
          <Text style={[styles.title, { fontSize: 24, fontWeight: "bold" }]}>
            Verify your account
          </Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Verification code</Text>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Enter your verification code"
              placeholderTextColor="#9ca3af"
              onChangeText={(code) => setCode(code)}
              keyboardType="numeric"
            />
          </View>
          {errors?.fields?.code && (
            <Text style={styles.error}>{errors.fields.code.message}</Text>
          )}
          {errors?.global && (
            <Text style={styles.error}>
              {errors.global.map((e) => e.message).join(", ")}
            </Text>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              fetchStatus === "fetching" && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleVerify}
            disabled={fetchStatus === "fetching"}
          >
            {fetchStatus === "fetching" ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </Pressable>
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
            <Ionicons name="chevron-back" size={20} color="#000000" />
            <Text style={styles.backButtonText}>sign-in</Text>
          </Pressable>
        </Link>
        <Text style={styles.headerTitle}>sign-up</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Sign up</Text>
        {errors?.fields?.emailAddress && (
          <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
        )}
        {errors?.fields?.password && (
          <Text style={styles.error}>{errors.fields.password.message}</Text>
        )}
        {errors?.global && (
          <Text style={styles.error}>
            {errors.global.map((e) => e.message).join(", ")}
          </Text>
        )}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor="#9ca3af"
            onChangeText={setEmailAddress}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            fetchStatus === "fetching" && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={fetchStatus === "fetching"}
        >
          {fetchStatus === "fetching" ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
        </Pressable>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/sign-in" asChild>
            <Pressable>
              <Text style={styles.linkText}>Sign in</Text>
            </Pressable>
          </Link>
        </View>

        {/* Required for bot detection / captcha challenges */}
        <View nativeID="clerk-captcha" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  error: {
    color: "#ef4444",
    marginBottom: 12,
    fontSize: 14,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  button: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  linkText: {
    fontSize: 14,
    color: "#0284c7",
    fontWeight: "600",
  },
});