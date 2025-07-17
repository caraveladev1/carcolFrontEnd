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

  const baseClassName = `bg-transparent font-itf text-lg uppercase border-2 border-pink p-4 w-full h-full min-h-[60px] text-pink focus:outline-none focus:border-2 focus:border-pink accent-pink-500 ${className}`;

  return (
    <>
      <input
        {...field}
        {...props}
        type="date"
        className={baseClassName}
      />
      {/*
        El icono del calendario no se puede estilizar con Tailwind.
        Usamos un filtro CSS para forzar el color rosa (tailwind pink: #E0B2B9) en navegadores Webkit.
      */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: brightness(0) saturate(100%) invert(92%) sepia(7%) saturate(1016%) hue-rotate(292deg) brightness(97%) contrast(91%);
        }
      `}</style>
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </>
  );
}