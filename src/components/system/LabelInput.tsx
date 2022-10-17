import React, { useCallback, useState } from 'react';
import type { Props as InputProps } from './Input';
import Input from './Input';

interface Props extends InputProps {
  labelName: string;
}

export default React.forwardRef<HTMLInputElement, Props>(function LabelInput(
  { labelName, onFocus, onBlur, ...props },
  ref,
) {
  const [focused, setFocused] = useState(false);

  // ? onFocus?.(e), onBlur?.(e)
  // Input의 Props에 onFocus, onBlur를 설정하고 ...props로 onFocus, onBlur가 넘어가면
  // ...props로 넘어간 onFocus, onBlur는 무시된다.
  // Props의 handler에 onFocus, onBlur를 넣어서 호출하는 방식으로 구현하면 된다.

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(e);
      setFocused(true);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      setFocused(false);
    },
    [onBlur],
  );

  return (
    <div className="group peer flex flex-col">
      <label
        htmlFor="input"
        className={`mb-2 text-base font-semibold leading-normal  ${
          focused ? 'text-orange-500' : 'text-gray-500'
        } `}
      >
        {labelName}
      </label>

      <Input ref={ref} onFocus={handleFocus} onBlur={handleBlur} {...props} />
    </div>
  );
});
