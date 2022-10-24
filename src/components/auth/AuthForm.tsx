import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LabelInput from '../system/LabelInput';
import { signIn, useSession } from 'next-auth/react';
import Button from '../system/Button';
import SocialAuth from './SocialAuth';
import { useRouter } from 'next/router';

function cls(...classnames: string[]) {
  return classnames.join(' ');
}

const authSchema = z.object({
  email: z
    .string()
    .email({ message: '이메일 형식이 아닙니다' })
    .optional()
    .or(z.literal('')),
  phone: z.number().optional(),
});

export type AuthInput = z.infer<typeof authSchema>;

interface Props {
  mode: 'login' | 'register';
  // error?: AppError;
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<AuthInput>({
    resolver: zodResolver(authSchema),
  });

  const { data: session, status } = useSession();

  console.log('session:  ', session);
  console.log('status:  ', status);

  // useEffect(() => {
  //   if (session) {
  //     window.location.href = '/';
  //   }
  // }, [session]);

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const onEmailClick = () => setMethod('email');
  const onPhoneClick = () => setMethod('phone');

  const signInWithEmail = async (email: string) => {
    try {
      // Perform sign in
      await signIn('email', {
        redirect: false, // 로그인 실패 시 새로고침 여부
        callbackUrl: '/',
        email,
      });
      console.log('메일 확인하세요');
      // setShowConfirm(true);
    } catch (err) {
      console.log('에러 발생');
    } finally {
    }
  };

  const onValid: SubmitHandler<AuthInput> = (data) => {
    if (method === 'email') {
      console.log('input Data: ', data.email);
      signInWithEmail(data.email!);
    } else if (method === 'phone') {
      console.log('input Data: ', data.phone);
    }
  };

  // console.log('watch: ', watch());
  if (errors.email || errors.phone) {
    console.log({ errors });
  }

  return (
    <div className="mt-16 px-4">
      <h3 className="text-3xl font-bold text-center">로그인</h3>
      <div className="mt-12">
        <div className="flex flex-col items-center">
          <h5 className="text-sm text-gray-500 font-medium">
            로그인 방식 선택
          </h5>
          <div className="grid  border-b  w-full mt-8 grid-cols-2 ">
            <button
              className={cls(
                'pb-4 font-medium text-sm border-b-2',
                method === 'email'
                  ? ' border-orange-500 text-orange-400'
                  : 'border-transparent hover:text-gray-400 text-gray-500',
              )}
              onClick={onEmailClick}
            >
              이메일
            </button>
            <button
              className={cls(
                'pb-4 font-medium text-sm border-b-2',
                method === 'phone'
                  ? ' border-orange-500 text-orange-400'
                  : 'border-transparent hover:text-gray-400 text-gray-500',
              )}
              onClick={onPhoneClick}
            >
              전화번호
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onValid)} className="flex flex-col mt-8">
          <div className="my-2">
            {method === 'email' && (
              <LabelInput
                id="input"
                type="email"
                {...register('email')}
                labelName="이메일"
                placeholder="leo@google.com"
                className=""
                errorMessage={errors.email?.message}
                required
              />
            )}

            {method === 'phone' && (
              <LabelInput
                id="input"
                type="number"
                labelName="전화번호"
                {...register('phone', {
                  setValueAs(value) {
                    return Number(value);
                  },
                })}
                required
              />
            )}
          </div>

          <Button layoutMode="fullWidth">
            {method === 'email' ? '로그인 링크 얻기' : null}
            {method === 'phone' ? 'one-time password 얻기' : null}
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute w-full border-t border-gray-300" />
            <div className="relative -top-3 text-center ">
              <span className="bg-white px-2 text-sm text-gray-500">
                Or enter with
              </span>
            </div>
          </div>

          {/* 소셜 로그인 버튼 */}
          <SocialAuth />
        </div>
      </div>
    </div>
  );
}
