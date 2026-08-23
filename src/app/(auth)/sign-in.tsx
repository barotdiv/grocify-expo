import { useSignIn } from '@clerk/expo/legacy'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useSocialAuth, { SocialStrategy } from '../../hooks/useSocialAuth'

function GoogleIcon() {
  return (
    <View style={styles.googleIconContainer}>
      <Ionicons name="logo-google" size={18} color="#4285F4" />
    </View>
  )
}

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { handleSocialAuth, loadingStrategy } = useSocialAuth()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleContinue = async () => {
    if (!emailAddress.trim()) return
    if (!showPassword) {
      setShowPassword(true)
      return
    }
    await onSignInPress()
  }

  const onSignInPress = async () => {
    if (!isLoaded || !signIn) return
    setLoading(true)
    setErrorMsg('')

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
        setErrorMsg('Sign in incomplete. Please try again.')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      const message =
        err?.errors?.[0]?.message ||
        err?.message ||
        'An error occurred during sign in.'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>sign-in</Text>
      </View>

      {/* Main content dark container */}
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Continue to Grocify</Text>
          <Text style={styles.subtitle}>Welcome! Sign in to continue</Text>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#6b7280"
              onChangeText={(text) => {
                setEmailAddress(text)
                if (errorMsg) setErrorMsg('')
              }}
              keyboardType="email-address"
            />

            {showPassword && (
              <TextInput
                style={styles.input}
                value={password}
                placeholder="Enter password"
                placeholderTextColor="#6b7280"
                secureTextEntry={true}
                onChangeText={(text) => {
                  setPassword(text)
                  if (errorMsg) setErrorMsg('')
                }}
              />
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              (!emailAddress.trim() || loading) && styles.continueButtonDisabled,
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleContinue}
            disabled={!emailAddress.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#121214" />
            ) : (
              <Text
                style={[
                  styles.continueButtonText,
                  !emailAddress.trim() && styles.continueButtonTextDisabled,
                ]}
              >
                {showPassword ? 'Sign in ›' : 'Continue ›'}
              </Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Auth Buttons */}
          <View style={styles.socialRow}>
            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                loadingStrategy === 'oauth_apple' && styles.socialButtonActive,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => handleSocialAuth('oauth_apple')}
              disabled={!!loadingStrategy}
            >
              {loadingStrategy === 'oauth_apple' ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="logo-apple" size={20} color="#ffffff" />
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                loadingStrategy === 'oauth_github' && styles.socialButtonActive,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => handleSocialAuth('oauth_github')}
              disabled={!!loadingStrategy}
            >
              {loadingStrategy === 'oauth_github' ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="logo-github" size={20} color="#ffffff" />
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                loadingStrategy === 'oauth_google' && styles.socialButtonActive,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => handleSocialAuth('oauth_google')}
              disabled={!!loadingStrategy}
            >
              {loadingStrategy === 'oauth_google' ? (
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

          {/* Don't have an account link */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Link href="/sign-up" asChild>
              <Pressable>
                <Text style={styles.signUpLink}>Sign up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 44,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  container: {
    flex: 1,
    backgroundColor: '#121214',
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  card: {
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 28,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 14,
  },
  inputGroup: {
    gap: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1e1e22',
    borderWidth: 1,
    borderColor: '#2d2d34',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#ffffff',
  },
  continueButton: {
    backgroundColor: '#e1e1e6',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#333338',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#121214',
  },
  continueButtonTextDisabled: {
    color: '#71717a',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#27272a',
  },
  dividerText: {
    color: '#71717a',
    fontSize: 13,
    paddingHorizontal: 14,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#1e1e22',
    borderWidth: 1,
    borderColor: '#2d2d34',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonActive: {
    borderColor: '#60a5fa',
  },
  googleIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSecured: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  securedText: {
    fontSize: 12,
    color: '#71717a',
  },
  clerkLogoDot: {
    fontSize: 8,
    color: '#6366f1',
  },
  clerkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#71717a',
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38bdf8',
  },
})