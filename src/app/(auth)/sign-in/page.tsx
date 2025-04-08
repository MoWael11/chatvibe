import { SignInModal } from '@/components/modals/sign-in-modal';
import { auth } from 'auth';
import { redirect } from 'next/navigation';

const SignInPage = async ({ searchParams: { callbackUrl } }: { searchParams: { callbackUrl?: string } }) => {
  const session = await auth();
  if (session) redirect('/');
  return (
    <>
      <h1 className="sr-only">ChatVibe | Connect and Chat with Friends</h1>
      <h3 className="sr-only">
        A messaging application that allows you to connect and chat with friends in real-time. Join the conversation!
      </h3>
      <SignInModal callbackUrl={callbackUrl} />
    </>
  );
};

export default SignInPage;
