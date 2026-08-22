import { useSignIn } from "@clerk/expo";
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
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    if (!signIn) return;
    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });
      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl("/");
            if (typeof window !== "undefined" && url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url as Href);
            }
          },
        });
      } else if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_client_trust"
      ) {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code"
        );
        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        }
      } else {
        console.error("Sign-in attempt not complete:", signIn);
      }
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  const handleVerify = async () => {
    if (!signIn) return;
    try {
      await signIn.mfa.verifyEmailCode({ code });
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl("/");
            if (typeof window !== "undefined" && url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url as Href);
            }
          },
        });
      } else {
        console.error("Sign-in verification attempt not complete:", signIn);
      }
    } catch (err) {
      console.error("Verify error:", err);
    }
  };

  if (
    signIn?.status === "needs_second_factor" ||
    signIn?.status === "needs_client_trust"
  ) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>sign-in</Text>
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
              onChangeText={setCode}
              keyboardType="numeric"
            />
          </View>
          {errors?.fields?.code && (
            <Text style={styles.errorText}>{errors.fields.code.message}</Text>
          )}
          {errors?.global && (
            <Text style={styles.errorText}>
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
        <Text style={styles.headerTitle}>sign-in</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Sign in</Text>

        {errors?.fields?.identifier && (
          <Text style={styles.errorText}>{errors.fields.identifier.message}</Text>
        )}
        {errors?.fields?.password && (
          <Text style={styles.errorText}>{errors.fields.password.message}</Text>
        )}
        {errors?.global && (
          <Text style={styles.errorText}>
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
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </Pressable>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/sign-up" asChild>
            <Pressable>
              <Text style={styles.linkText}>Sign up</Text>
            </Pressable>
          </Link>
        </View>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
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
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  errorText: {
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
