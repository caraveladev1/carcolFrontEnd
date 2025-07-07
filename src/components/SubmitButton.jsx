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

export function SubmitButton({ color, typeButton, className, onClick, buttonText, loading = false, disabled = false }) {
	const { t } = useTranslation();

	const buttonColorClasses = colorClasses[color] || colorClasses.default;
	const isDisabled = loading || disabled;

	return (
		<button
			type={typeButton}
			onClick={onClick}
			disabled={isDisabled}
			className={`${buttonColorClasses} font-bayard text-2xl p-4 h-full flex items-center justify-center gap-2 ${className || ''} ${
				isDisabled ? 'opacity-50 cursor-not-allowed' : ''
			}`}
		>
			{loading && (
				<svg
					className='animate-spin h-5 w-5 text-white'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
				>
					<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
					<path
						className='opacity-75'
						fill='currentColor'
						d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
					></path>
				</svg>
			)}
			{t(buttonText)}
		</button>
	);
}
