import React from 'react';

/**
 * 떠 있는 등록 버튼
 */
export default function FloatCreateButton() {
  return (
    <button className="fixed hover:bg-orange-500 transition-colors cursor-pointer  bottom-24 right-5 shadow-xl bg-orange-400 rounded-full p-4 text-white">
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  );
}
