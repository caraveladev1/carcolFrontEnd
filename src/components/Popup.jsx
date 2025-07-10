import React from 'react';
import { useTranslation } from 'react-i18next';

export function Popup({ isOpen, onClose, title, message, type = 'info' }) {
	const { t } = useTranslation();

	if (!isOpen) return null;

	const getTypeStyles = () => {
		switch (type) {
			case 'error':
				return 'border-red-500 bg-red-50';
			case 'warning':
				return 'border-yellow-500 bg-yellow-50';
			case 'success':
				return 'border-green-500 bg-green-50';
			default:
				return 'border-blue-500 bg-blue-50';
		}
	};

	const getIconColor = () => {
		switch (type) {
			case 'error':
				return 'text-red-600';
			case 'warning':
				return 'text-yellow-600';
			case 'success':
				return 'text-green-600';
			default:
				return 'text-blue-600';
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className={`bg-beige  border-2 ${getTypeStyles()} p-6 max-w-md w-full mx-4 shadow-xl`}>
				<div className='flex items-start'>
					<div className={`flex-shrink-0 ${getIconColor()}`}>
						{type === 'error' && (
							<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
								/>
							</svg>
						)}
						{type === 'warning' && (
							<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
								/>
							</svg>
						)}
						{type === 'success' && (
							<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						)}
						{type === 'info' && (
							<svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						)}
					</div>
					<div className='ml-3 w-0 flex-1'>
						{title && <h3 className='text-lg font-itf font-medium text-cafe mb-2'>{title}</h3>}
						<p className='text-lg text-cafe font-itf'>{message}</p>
					</div>
				</div>
				<div className='mt-4 flex justify-end'>
					<button
						onClick={onClose}
						className='bg-beige hover:bg-naranja font-itf text-cafe font-medium p-4 transition-colors duration-200'
					>
						{t('close') || 'Cerrar'}
					</button>
				</div>
			</div>
		</div>
	);
}
