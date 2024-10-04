'use client'
import GuestLoginForm from './guest-login-form'

export default function TableNumberPage({ params }: { params: { number: string } }) {
  return <GuestLoginForm tableNumber={params.number} />
}
