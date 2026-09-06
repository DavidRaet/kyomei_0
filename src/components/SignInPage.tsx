import { SignIn } from '@clerk/react'
import { AuthPage } from './AuthPage'
import { clerkAppearance } from '../auth/clerkAppearance'

export function SignInPage() {
  return (
    <AuthPage mode="sign-in">
      <SignIn
        appearance={clerkAppearance}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/"
      />
    </AuthPage>
  )
}
