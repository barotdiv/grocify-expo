import { useSession } from '@clerk/expo'
import { AuthView } from '@clerk/expo/native'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

export default function SignInScreen() {
  const { session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.status === 'active') {
      router.replace('/(home)')
    }
  }, [session?.status, router])

  return <AuthView mode="signInOrUp" />
}