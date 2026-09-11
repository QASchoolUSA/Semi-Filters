import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign in — Store management',
  robots: { index: false, follow: false },
}

export default async function StoreManagementLoginPage() {
  const session = await auth()
  if (session?.user) {
    redirect('/store-management/orders')
  }

  return (
    <div className="sm-login">
      <div className="sm-login__panel">
        <div className="sm-login__brand">
          <span className="sm-login__mark" aria-hidden="true" />
          <p className="sm-login__eyebrow">Semi Filters</p>
          <h1 className="sm-login__title">Store management</h1>
          <p className="sm-login__subtitle">
            Sign in to manage orders and print shipping labels.
          </p>
        </div>

        <Suspense fallback={<div className="sm-login__form-skeleton" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
