'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'

export type LoginState = {
  error?: string
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const callbackUrl = String(formData.get('callbackUrl') || '/store-management/orders')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl.startsWith('/store-management')
        ? callbackUrl
        : '/store-management/orders',
    })
    return {}
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' }
    }
    throw error
  }
}
