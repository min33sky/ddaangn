import TabLayout from '@/components/layout/TabLayout';
import Button from '@/components/system/Button';
import ImageUpload from '@/components/system/ImageUpload';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function UploadPage() {
  // const [imageUrl, setImageUrl] = useState(image ? image : '');

  const uploadImage = async (image: File) => {
    console.log('image: ', image);
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

      console.log('url: ', url);

      // setImageUrl(url);
      toast.success('이미지 업로드 성공', { id: toastId });
    } catch (error) {
      toast.error('이미지 업로드 실패');
    } finally {
    }
  };

  return (
    <TabLayout>
      <div className="px-4 space-y-5 flex-1 py-10 ">
        <div className="mb-8">
          <ImageUpload onChangeImage={uploadImage} />
          {/* <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input className="hidden" type="file" />
          </label> */}
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            Name
          </label>
          <div className="rounded-md relative flex  items-center shadow-sm">
            <input
              id="name"
              type="email"
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="price"
          >
            Price
          </label>
          <div className="rounded-md relative flex  items-center shadow-sm">
            <div className="absolute left-0 pointer-events-none pl-3 flex items-center justify-center">
              <span className="text-gray-500 text-sm">$</span>
            </div>
            <input
              id="price"
              className="appearance-none pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              type="text"
              placeholder="0.00"
            />
            <div className="absolute right-0 pointer-events-none pr-3 flex items-center">
              <span className="text-gray-500">USD</span>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 "
            rows={4}
          />
        </div>

        <Button layoutMode="fullWidth">상품 업로드</Button>
      </div>
    </TabLayout>
  );
}
