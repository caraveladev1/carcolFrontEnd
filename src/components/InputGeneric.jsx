import React from 'react';
import { useTranslation } from 'react-i18next';

export function InputGeneric({ type = 'text', filter, defaultValue, options = [], onChange, required, className }) {
	const { t } = useTranslation();

	return (
		<>
			{type === 'select' ? (
				<div className='w-full h-full '>
					<input
						list={`${filter}-options`}
						id={filter}
						name={filter}
						defaultValue={defaultValue}
						className='bg-transparent font-bayard text-xl uppercase border-2 border-pink p-4 w-full text-pink focus:outline-none focus:border-2 focus:border-pink m-auto h-full'
						onChange={onChange}
						required={required}
						placeholder={`Select ${t(filter)}`}
						autoComplete='off'
					/>
					<datalist id={`${filter}-options`}>
						{options.map((option, index) => (
							<option key={index} value={option} />
						))}
					</datalist>
				</div>
			) : type === 'date' ? (
				<input
					type='date'
					id={filter}
					name={filter}
					defaultValue={defaultValue}
					className='bg-transparent font-bayard text-xl uppercase border-2 border-pink p-4 w-[94%] text-pink focus:outline-none focus:border-2 focus:border-pink  h-full'
					onChange={onChange}
					required={required}
				/>
			) : (
				<input
					type='text'
					id={filter}
					name={filter}
					defaultValue={defaultValue}
					className='bg-transparent font-bayard text-xl uppercase border-2 border-pink p-4 w-full text-pink focus:outline-none focus:border-2 focus:border-pink m-auto h-full'
					onChange={onChange}
					required={required}
				/>
			)}
		</>
	);
}
