import React from 'react';

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

export default React.forwardRef<HTMLInputElement, Props>(function Input(
  { errorMessage, className, ...props },
  ref,
) {
  return (
    <>
      <input
        ref={ref}
        className={`h-12 appearance-none w-full rounded border border-gray-400 px-4 text-base outline-none placeholder:text-gray-400
      focus:border-orange-500 disabled:bg-gray-200 ${className}`}
        {...props}
      />
      {errorMessage && (
        <div className="mt-2 text-sm text-rose-500">{errorMessage}</div>
      )}
    </>
  );
});
