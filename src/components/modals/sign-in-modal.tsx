'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const SignInModal = ({ callbackUrl }: { callbackUrl?: string }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Dialog open>
      <DialogContent withOutOverlay isAlwaysOpen className="bg-[#202020] px-0 max-w-[420px] w-full min-h-[450px]">
        <DialogHeader className="pt-8 px-6">
          <div className="size-[100px] relative mx-auto animate-logo rounded-full mb-2">
            <Image fill src={'/images/logo.png'} alt="logo" />
          </div>
          <DialogTitle className="text-4xl text-center">Sign in</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">Sign in with your google account</DialogDescription>
        </DialogHeader>
        <Button
          onClick={() => signIn('google', { callbackUrl: callbackUrl ? callbackUrl : '/' })}
          className="text-black gap-4 max-w-72 text-base w-full m-auto py-8 rounded-xl"
        >
          <div className="size-[26px] relative">
            <Image fill src={'/images/google.png'} alt="google icon" />
          </div>
          Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
};
