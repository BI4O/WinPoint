'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
  containerClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, error, suffix, containerClassName, children, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn('relative', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-md-on-surface mb-2 ml-1">
            {label}
          </label>
        )}
        <div
          className={cn(
            'md-input-filled relative',
            'bg-md-surface-container-low',
            'rounded-t-xl rounded-b-none',
            'transition-all duration-200 ease-md'
          )}
        >
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-4',
              'bg-transparent',
              'text-md-on-surface text-lg font-medium',
              'placeholder:text-md-on-surface-variant/50',
              'focus:outline-none',
              'rounded-t-xl',
              error && 'text-md-error',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-md-on-surface-variant text-sm">
              {suffix}
            </span>
          )}
        </div>
        {/* Focus ring enhancement */}
        {isFocused && (
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-md-primary/20 rounded-full" />
        )}
        {error && (
          <p className="mt-2 ml-1 text-sm text-md-error">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
