import { SignInModal } from '@/components/modals/sign-in-modal'
import { auth } from 'auth'
import { redirect } from 'next/navigation'

const SignInPage = async ({ searchParams: { callbackUrl } }: { searchParams: { callbackUrl?: string } }) => {
  const session = await auth()
  if (session) redirect('/')
  return <SignInModal callbackUrl={callbackUrl} />
}

export default SignInPage
