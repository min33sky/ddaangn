import AuthForm from '@/components/auth/AuthForm';
import BasicLayout from '@/components/layout/BasicLayout';
import React from 'react';

export default function SigninPage() {
  return (
    <BasicLayout hasBackButton title="로그인">
      <AuthForm mode="login" />
    </BasicLayout>
  );
}
