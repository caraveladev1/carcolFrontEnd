import React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export function TextInput({
	name,
	control,
	type = 'text',
	placeholder,
	className = '',
	required = false,
	rules = {},
	as = 'input',
	caseSensitive = false,
	...props
}) {
	const { t } = useTranslation();
	const {
		field,
		fieldState: { error },
	} = useController({
		name,
		control,
		rules: { required: required && `${name} is required`, ...rules },
	});

	const textTransformClass = caseSensitive ? '' : 'uppercase';
	const baseClassName =
		`bg-transparent font-bayard text-xl ${textTransformClass} border-2 border-pink p-4 w-full h-full min-h-[60px] text-pink focus:outline-none focus:border-2 focus:border-pink ${className}`.trim();

	const Component = as;

	return (
		<>
			<Component
				{...field}
				{...props}
				type={as === 'input' ? type : undefined}
				placeholder={placeholder || `Enter ${t(name)}`}
				className={baseClassName}
			/>
			{error && <span className='text-red-500 text-sm'>{error.message}</span>}
		</>
	);
}
