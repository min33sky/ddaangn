import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  label?: string;
  initialImage?: string;
  sizeLimit?: number;
  onChangeImage: (image: File) => void;
}

export default function ImageUpload({
  label,
  initialImage,
  sizeLimit = 10 * 1024 * 1024, // 이미지 크기 10MB 제한
  onChangeImage,
}: Props) {
  const [image, setImage] = useState(initialImage);

  const handleOnChangePicture: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.size > sizeLimit) {
        toast.error('10MB 이하의 이미지만 업로드 가능해요.');
        return;
      }

      // 미리보기 이미지 설정
      const previewImage = URL.createObjectURL(e.target.files[0]);
      setImage(previewImage);

      // 이미지 업로드 API 호출
      onChangeImage(file);
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image); // 메모리 해제
      }
    };
  }, [image]);

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-gray-600 select-none font-semibold">
        {label ?? '이미지 업로드'}
      </p>

      <label
        className="
              flex cursor-pointer aspect-w-16 aspect-h-9 relative
              items-center justify-center rounded-md
              border-2 border-dashed border-gray-300 text-gray-600 transition
              hover:border-slate-500 hover:text-slate-500"
      >
        {image && (
          <Image src={image} layout="fill" objectFit="contain" alt="preview" />
        )}
        {!image && (
          <svg
            className="h-14 w-14 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
        )}
        <input
          className="hidden"
          type="file"
          accept=".png, .jpg, .jpeg, .gif"
          onChange={handleOnChangePicture}
        />
      </label>
    </div>
  );
}
