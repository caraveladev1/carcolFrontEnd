import React from 'react';
import { useTranslation } from 'react-i18next';

export function InputGeneric({ type, filter, defaultValue, options = [], onChange }) {
	const { t } = useTranslation();

	return (
		<>
			{type === 'select' ? (
				<select
					id={filter}
					name={filter}
					defaultValue={defaultValue}
					className='bg-transparent font-bayard text-xl uppercase border-2 border-pink p-4 w-full text-pink focus:outline-none focus:border-2 focus:border-pink m-auto h-full'
					onChange={onChange} // Añadir el manejador de eventos
				>
					{/* Opción predeterminada */}
					<option value='' disabled hidden>
						{`${t('select')} ${t(filter)} `}
					</option>
					{/* Opción seleccionada por defecto */}
					<option value={defaultValue} hidden>
						{`${t('select')} ${t(filter)} `}
					</option>
					{/* Renderizar las opciones que se pasan como prop */}
					{options.map((option, index) => (
						<option key={index} value={option}>
							{option}
						</option>
					))}
				</select>
			) : (
				<input
					type={type || 'text'}
					id={filter}
					name={filter}
					defaultValue={defaultValue}
					className='bg-transparent font-bayard text-xl uppercase border-2 border-pink p-4 w-full text-pink focus:outline-none focus:border-2 focus:border-pink m-auto h-full'
					onChange={onChange} // Añadir el manejador de eventos
				/>
			)}
		</>
	);
}
