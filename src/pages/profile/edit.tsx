import TabLayout from '@/components/layout/TabLayout';
import Button from '@/components/system/Button';
import LabelInput from '@/components/system/LabelInput';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

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

export default function EditPage() {
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

  console.log(watch());
  console.log(errors);

  return (
    <TabLayout>
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            이미지 변경
            <input
              id="picture"
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
          required
        />

        <LabelInput
          {...register('email')}
          labelName="이메일"
          type={'email'}
          placeholder="이메일을 적어주세요"
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
        />

        <Button layoutMode="fullWidth">변경하기</Button>
      </form>
    </TabLayout>
  );
}
