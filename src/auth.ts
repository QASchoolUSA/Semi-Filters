import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export type StoreUser = {
  email: string
  passwordHash: string
  name?: string
}

function getStoreUsers(): StoreUser[] {
  const raw = process.env.STORE_MANAGEMENT_USERS
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as StoreUser[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    console.error('STORE_MANAGEMENT_USERS is not valid JSON')
    return []
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === 'string' ? credentials.email.trim().toLowerCase() : ''
        const password = typeof credentials?.password === 'string' ? credentials.password : ''
        if (!email || !password) return null

        const users = getStoreUsers()
        const user = users.find((u) => u.email.trim().toLowerCase() === email)
        if (!user?.passwordHash) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.email,
          email: user.email,
          name: user.name || user.email.split('@')[0],
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/store-management/login',
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl
      if (!pathname.startsWith('/store-management')) return true
      if (pathname.startsWith('/store-management/login')) return true
      return !!session?.user
    },
    jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  trustHost: true,
})
