import React from 'react';
import { useTranslation } from 'react-i18next';

const colorClasses = {
	naranja: 'bg-naranja text-white hover:bg-naranja/90 transition-colors',
	verdeTexto: 'bg-verdeTexto text-white hover:bg-verdeTexto/90 transition-colors',
	celeste: 'bg-celeste text-white hover:bg-celeste/90 transition-colors',
	pink: 'bg-pink text-white hover:bg-pink/90 transition-colors',
	cafe: 'bg-cafe text-white hover:bg-cafe/90 transition-colors',
	beige: 'bg-beige text-verdeTexto hover:bg-beige/90 transition-colors',
	default: 'bg-gray-500 text-white hover:bg-gray-600 transition-colors',
};

export function SubmitButton({ color, typeButton, className, onClick, buttonText }) {
	const { t } = useTranslation();

	const buttonColorClasses = colorClasses[color] || colorClasses.default;

	return (
		<button
			type={typeButton}
			onClick={onClick}
			className={`${buttonColorClasses} font-bayard text-2xl p-4 h-full ${className || ''}`}
		>
			{t(buttonText)}
		</button>
	);
}
