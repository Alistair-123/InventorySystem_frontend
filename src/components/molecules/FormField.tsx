import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Input } from '../atoms/Input';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  variant?: 'default' | 'auth' | 'search';
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    props,
    ref
  ) => {
    const { label, name, error, variant = 'default', placeholder, type = 'text', ...rest } = props;

    return (
     
        <Input
          label={label}
          name={name}
          error={error}
          variant={variant}
          placeholder={placeholder}
          type={type}
          ref={ref}
          {...rest}
        />
    
    );
  }
);


FormField.displayName = 'FormField';
