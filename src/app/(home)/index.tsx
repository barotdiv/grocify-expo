import { Show, useClerk, useUser } from "@clerk/expo";
import { Link } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welocme!</Text>
      <Show when="signed-out">
        <Link href="/(auth)/sign-in">
          <Text style={styles.linkText}>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text style={styles.linkText}>Sign up</Text>
        </Link>
      </Show>
      <Show when="signed-in">
        <Text style={styles.helloText}>Hello {user?.emailAddresses?.[0]?.emailAddress}</Text>
        <Pressable style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </Show>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  helloText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4b5563",
    marginBottom: 24,
  },
  linkText: {
    fontSize: 16,
    color: "#0284c7",
    fontWeight: "600",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
