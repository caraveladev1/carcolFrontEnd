import React from 'react';
import { useController } from 'react-hook-form';

export function DateInput({ 
  name, 
  control, 
  className = '', 
  required = false,
  rules = {},
  ...props 
}) {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control,
    rules: { required: required && `${name} is required`, ...rules }
  });

  const baseClassName = `bg-transparent font-itf text-lg uppercase border-2 border-pink p-4 w-full h-full min-h-[60px] text-pink focus:outline-none focus:border-2 focus:border-pink ${className}`;

  return (
    <>
      <input
        {...field}
        {...props}
        type="date"
        className={baseClassName}
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </>
  );
}