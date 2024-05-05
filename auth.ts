import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const config = {
  providers: [Google],
  callbacks: {
    authorized({ auth }) {
      return !!auth
    },
    redirect({ url }) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const { pathname } = new URL(url) // Getting the pathname part of the URL ex: /servers/32323kl4j32kljfkl
      return `${baseUrl}${pathname}`
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
