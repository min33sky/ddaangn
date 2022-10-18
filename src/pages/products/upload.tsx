import TabLayout from '@/components/layout/TabLayout';
import Button from '@/components/system/Button';
import ImageUpload from '@/components/system/ImageUpload';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import LabelInput from '@/components/system/LabelInput';
import LabelTextarea from '@/components/system/LabelTextarea';
import { useMutation } from '@tanstack/react-query';
import { CreateProduct, createProduct } from '@/lib/api/products';
import useCreateProduct from '@/hooks/products/useCreateProduct';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';

const uploadSchema = z.object({
  name: z.string().min(1, { message: '상품명을 입력해주세요' }),
  price: z.number().min(1, { message: '가격을 입력해주세요' }),
  description: z.string().min(1, { message: '상품 설명을 입력해주세요' }),
});

export type UploadInput = z.infer<typeof uploadSchema>;

export default function UploadPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(''); //? 수정 모드일 때 적용할 코드

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UploadInput>({
    resolver: zodResolver(uploadSchema),
  });

  const { mutate, isLoading } = useCreateProduct({
    onSuccess: () => {
      console.log('상품 등록 성공!!!!!');
      router.replace('/');
    },
  });

  const uploadImage = async (image: File) => {
    if (!image) return;
    let toastId: string;

    try {
      const ext = image.name.split('.').pop();
      const path = `${image.name.split('.')[0]}_${Date.now()}.${ext}`;

      toastId = toast.loading('이미지 업로드 중...');

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
        .upload(path, image);

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(
        '.co',
        '.in',
      )}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET!}/${
        uploadData?.path
      }`;
      console.log('image URL: ', url);

      setImageUrl(url);
      toast.success('이미지 업로드 성공', { id: toastId });
    } catch (error) {
      toast.error('이미지 업로드 실패');
    } finally {
    }
  };

  const onValid: SubmitHandler<UploadInput> = (data) => {
    mutate({
      image: imageUrl,
      ...data,
    });
  };

  return (
    <TabLayout>
      <form onSubmit={handleSubmit(onValid)} className="px-4 space-y-5 py-10">
        <ImageUpload onChangeImage={uploadImage} />

        <LabelInput
          {...register('name')}
          type="text"
          labelName="상품 이름"
          placeholder='상품 이름을 입력해주세요. 예) "테스트 상품"'
          errorMessage={errors.name?.message}
        />

        <LabelInput
          {...register('price', { valueAsNumber: true })}
          type="number"
          labelName="상품 가격"
          placeholder="상품 가격을 입력해주세요"
          errorMessage={errors.price?.message}
        />

        <LabelTextarea
          {...register('description')}
          labelName="상품 설명"
          rows={5}
          placeholder="상품 설명을 입력해주세요"
        />

        <Button disabled={isLoading} layoutMode="fullWidth">
          상품 업로드
        </Button>
      </form>
    </TabLayout>
  );
}
