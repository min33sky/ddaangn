import React, { useState } from 'react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelName: string;
}

export default React.forwardRef<HTMLTextAreaElement, Props>(
  function LabelTextArea(
    { labelName, onBlur, onFocus, className, ...rest },
    ref,
  ) {
    const [focused, setFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      onFocus?.(e);
      setFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlur?.(e);
      setFocused(false);
    };

    return (
      <div className="flex flex-1 flex-col">
        <label
          htmlFor=""
          className={`mb-2 text-base font-semibold leading-normal ${
            focused ? 'text-orange-500' : 'text-gray-500'
          } `}
        >
          {labelName}
        </label>
        <textarea
          ref={ref}
          className={`flex-1 resize-none rounded border p-4 text-base leading-normal text-gray-800 outline-none transition ease-in-out
          placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-500
          ${focused ? 'border-orange-500' : 'border-gray-400'}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </div>
    );
  },
);
