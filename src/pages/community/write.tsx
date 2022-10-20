import useCreatePost from '@/hooks/community/useCreatePost';
import React from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LabelTextarea from '@/components/system/LabelTextarea';
import Button from '@/components/system/Button';
import { useRouter } from 'next/router';

const writeSchema = z.object({
  question: z.string().min(1).max(100).trim(),
});

type WriteInput = z.infer<typeof writeSchema>;

export default function CommunityWritePage() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<WriteInput>({
    resolver: zodResolver(writeSchema),
  });

  const { mutate, isLoading } = useCreatePost({
    onSuccess: (data) => {
      console.log('게시물 등록 성공 : ', data);
      router.replace(`/community/${data.id}`);
    },
  });

  const onValid: SubmitHandler<WriteInput> = (data) => {
    if (isLoading) return;
    console.log('data: ', data);
    mutate(data.question);
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="px-4 py-10">
      <LabelTextarea
        {...register('question')}
        placeholder="궁금한 것이 있다면 적어주세요"
        labelName="질문 내용"
        rows={4}
      />
      <Button disabled={isLoading} layoutMode="fullWidth">
        등록
      </Button>
    </form>
  );
}
