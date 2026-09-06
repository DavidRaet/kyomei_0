import { SignUp } from '@clerk/react'
import { AuthPage } from './AuthPage'
import { clerkAppearance } from '../auth/clerkAppearance'

export function SignUpPage() {
  return (
    <AuthPage mode="sign-up">
      <SignUp
        appearance={clerkAppearance}
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    </AuthPage>
  )
}
