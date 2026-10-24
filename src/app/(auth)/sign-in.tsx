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
import Svg, { Path } from 'react-native-svg'
import useSocialAuth from '../../hooks/useSocialAuth'

function GoogleIcon({ size = 22 }: { size?: number }) {
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
        <Link href="/sign-up" asChild>
          <Pressable style={styles.backButton}>
            <Ionicons name="chevron-back" size={18} color="#ffffff" />
            <Text style={styles.backButtonText}>sign-up</Text>
          </Pressable>
        </Link>
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

          {/* Continue Button */}
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              (!emailAddress.trim() || loading) && styles.continueButtonDisabled,
              pressed && styles.continueButtonPressed,
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
                {showPassword ? 'Sign In ›' : 'Continue ›'}
              </Text>
            )}
          </Pressable>

          {/* Divider */}
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
                loadingStrategy === 'oauth_apple' && styles.socialBoxActive,
                pressed && styles.socialBoxPressed,
              ]}
              onPress={() => handleSocialAuth('oauth_apple')}
              disabled={!!loadingStrategy}
              accessibilityLabel="Sign in with Apple"
            >
              {loadingStrategy === 'oauth_apple' ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="logo-apple" size={22} color="#ffffff" />
              )}
            </Pressable>

            {/* GitHub Box */}
            <Pressable
              style={({ pressed }) => [
                styles.socialBox,
                loadingStrategy === 'oauth_github' && styles.socialBoxActive,
                pressed && styles.socialBoxPressed,
              ]}
              onPress={() => handleSocialAuth('oauth_github')}
              disabled={!!loadingStrategy}
              accessibilityLabel="Sign in with GitHub"
            >
              {loadingStrategy === 'oauth_github' ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="logo-github" size={22} color="#ffffff" />
              )}
            </Pressable>

            {/* Google Box */}
            <Pressable
              style={({ pressed }) => [
                styles.socialBox,
                loadingStrategy === 'oauth_google' && styles.socialBoxActive,
                pressed && styles.socialBoxPressed,
              ]}
              onPress={() => handleSocialAuth('oauth_google')}
              disabled={!!loadingStrategy}
              accessibilityLabel="Sign in with Google"
            >
              {loadingStrategy === 'oauth_google' ? (
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

          {/* Don't have an account link in button format */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Link href="/sign-up" asChild>
              <Pressable style={({ pressed }) => [styles.linkButton, pressed && { opacity: 0.8 }]}>
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
    backgroundColor: '#121214',
  },
  header: {
    height: 48,
    backgroundColor: '#121214',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e22',
    borderWidth: 1,
    borderColor: '#33333b',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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
    fontSize: 24,
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
    paddingVertical: 14,
    fontSize: 15,
    color: '#ffffff',
  },
  continueButton: {
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#e5e5ea',
    opacity: 0.6,
  },
  continueButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
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
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#27272a',
  },
  dividerText: {
    color: '#71717a',
    fontSize: 13,
    paddingHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 28,
  },
  socialBox: {
    flex: 1,
    height: 52,
    backgroundColor: '#161618',
    borderWidth: 1,
    borderColor: '#2e2e34',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBoxActive: {
    borderColor: '#60a5fa',
    backgroundColor: '#27272e',
  },
  socialBoxPressed: {
    opacity: 0.75,
    backgroundColor: '#222228',
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
  linkButton: {
    backgroundColor: '#1e1e22',
    borderWidth: 1,
    borderColor: '#38bdf8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 4,
  },
  signUpLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38bdf8',
  },
})