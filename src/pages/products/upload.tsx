import TabLayout from '@/components/layout/TabLayout';
import Button from '@/components/system/Button';
import ImageUpload from '@/components/system/ImageUpload';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import LabelInput from '@/components/system/LabelInput';
import LabelTextarea from '@/components/system/LabelTextarea';

export default function UploadPage() {
  // const [imageUrl, setImageUrl] = useState(image ? image : '');

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

      // setImageUrl(url);
      toast.success('이미지 업로드 성공', { id: toastId });
    } catch (error) {
      toast.error('이미지 업로드 실패');
    } finally {
    }
  };

  return (
    <TabLayout>
      <div className="px-4 space-y-5 py-10">
        <ImageUpload onChangeImage={uploadImage} />

        <LabelInput type="text" labelName="상품 이름" />

        <LabelInput type="number" labelName="상품 가격" />

        <LabelTextarea labelName="상품 설명" rows={5} />

        <Button layoutMode="fullWidth">상품 업로드</Button>
      </div>
    </TabLayout>
  );
}
