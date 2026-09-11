'use client'

import React, { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginAction, type LoginState } from './actions'

const initialState: LoginState = {}

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/store-management/orders'
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="sm-login__form">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <label className="sm-login__field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          placeholder="you@semifilters.com"
        />
      </label>

      <label className="sm-login__field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </label>

      {state.error && (
        <p className="sm-login__error" role="alert">
          {state.error}
        </p>
      )}

      <button type="submit" className="sm-login__submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
