import TabLayout from '@/components/layout/TabLayout';
import Button from '@/components/system/Button';
import LabelInput from '@/components/system/LabelInput';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import getQueryClient from '@/lib/queryClient';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { queryKeys } from '@/constants';
import { userService } from '@/services/userService';
import { dehydrate } from '@tanstack/react-query';
import useGetMyStatus from '@/hooks/user/useGetMyStatus';

const EditSchema = z.object({
  name: z.string().min(2).max(10),
  email: z
    .string()
    .email({ message: '이메일 형식이 아닙니다' })
    .optional()
    .or(z.literal('')),
  phone: z.number().max(12).optional(),
});

type EditInput = z.infer<typeof EditSchema>;

/**
 * 프로필 수정 페이지
 */
export default function EditPage() {
  const { data: myStatus } = useGetMyStatus();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<EditInput>({
    resolver: zodResolver(EditSchema),
  });

  const onValid: SubmitHandler<EditInput> = (data) => {
    console.log(data);
  };

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      let toastId: string;

      try {
        const ext = file.name.split('.').pop();
        const path = `${file.name.split('.')[0]}_${Date.now()}.${ext}`;

        toastId = toast.loading('이미지 업로드 중...');

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
          .upload(path, file);

        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(
          '.co',
          '.in',
        )}/storage/v1/object/public/${process.env
          .NEXT_PUBLIC_SUPABASE_BUCKET!}/${uploadData?.path}`;
        console.log('image URL: ', url);

        setImageUrl(url);
        toast.success('이미지 업로드 성공', { id: toastId });
      } catch (error) {
        toast.error('이미지 업로드 실패');
      } finally {
      }
    }
  };

  console.log(watch());
  console.log(errors);

  //! 이미지 주소 지워야함
  // const tempImg =
  //   'https://lh3.googleusercontent.com/a/ALm5wu2iIvg4fTX9LLqmjbyL6lBKFHoe9jKQ9Hdip3vMTw=s96-c';

  if (!myStatus) {
    return <div>Loading.........</div>;
  }

  const { email, image, name, phone } = myStatus;

  return (
    <TabLayout>
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div
            style={{ backgroundImage: `url(${imageUrl ?? image})` }}
            className={`w-14 h-14 rounded-full bg-slate-500 bg-contain bg-no-repeat`}
          />
          <label
            htmlFor="picture"
            className={`cursor-pointer py-2 px-3 border border-gray-300
            rounded-md shadow-sm text-sm font-medium
            focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700
            `}
          >
            이미지 변경
            <input
              id="picture"
              onChange={handleChangeImage}
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        <LabelInput
          {...register('name')}
          labelName="이름"
          placeholder="이름을 적어주세요"
          defaultValue={name ?? ''}
          required
        />

        <LabelInput
          {...register('email')}
          labelName="이메일"
          type={'email'}
          placeholder="이메일을 적어주세요"
          defaultValue={email ?? ''}
        />

        <LabelInput
          id="input"
          type="number"
          labelName="전화번호"
          {...register('phone', {
            setValueAs(value) {
              return Number(value);
            },
          })}
          placeholder="전화번호를 적어주세요"
          defaultValue={phone ?? ''}
        />

        <Button layoutMode="fullWidth">변경하기</Button>
      </form>
    </TabLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = getQueryClient();
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/?callbackUrl=/profile',
        permanent: false,
      },
    };
  }

  await queryClient.prefetchQuery([queryKeys.getMyStatus], () =>
    userService.getMyStatus(session.user.id),
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
