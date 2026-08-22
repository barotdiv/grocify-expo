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
        <View style={styles.container}>
          <Text style={[styles.title, { fontSize: 24, fontWeight: "bold" }]}>
            Verify your account
          </Text>
          <TextInput
            style={styles.input}
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor="#666666"
            onChangeText={(code) => setCode(code)}
            keyboardType="numeric"
          />
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
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9ca3af"
          onChangeText={setEmailAddress}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9ca3af"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
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
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 12,
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