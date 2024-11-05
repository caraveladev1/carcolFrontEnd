import React from 'react';
import { useTranslation } from 'react-i18next';

export function SubmitButton({ color, typeButton, className, onClick, buttonText }) {
	const { t } = useTranslation();
	return (
		<button
			type={typeButton}
			onClick={onClick}
			className={`bg-${color} font-bayard text-2xl text-white p-4 ${className}`}
		>
			{t(buttonText)}
		</button>
	);
}
