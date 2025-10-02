"use client";
import { useEffect } from 'react';

export default function RegisterRedirect() {
  useEffect(() => {
    window.location.replace('/auth/register');
  }, []);
  return <div>Redirecting to /auth/register...</div>;
}
