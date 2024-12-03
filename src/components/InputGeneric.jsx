import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function InputGeneric({
	type = 'text',
	filter,
	defaultValue,
	options = [],
	onChange,
	required,
	placeholder,
	className,
	multiple = false, // Activa el multiselect
}) {
	const { t } = useTranslation();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [selectedValues, setSelectedValues] = useState(defaultValue || []);

	const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
	const handleOptionClick = (option) => {
		let updatedValues;

		// Si el select es múltiple, actualizamos el array de valores seleccionados
		if (multiple) {
			if (selectedValues.includes(option)) {
				updatedValues = selectedValues.filter((value) => value !== option);
			} else {
				updatedValues = [...selectedValues, option];
			}
		} else {
			// Si no es múltiple, simplemente seleccionamos un único valor
			updatedValues = option;
		}

		setSelectedValues(updatedValues);

		onChange({
			target: {
				name: filter,
				value: updatedValues,
			},
		});
	};

	return (
		<>
			{type === 'select' && multiple ? (
				<div className='relative w-full'>
					<button
						type='button'
						className={`bg-transparent font-bayard text-start text-xl uppercase border-2 border-pink p-5 w-full h-full  text-pink focus:outline-none focus:border-2 focus:border-pink ${className}`}
						onClick={toggleDropdown}
					>
						{selectedValues.length > 0 ? selectedValues.join(', ') : placeholder || `Select ${t(filter)}`}
					</button>

					{dropdownOpen && (
						<ul className='absolute bg-white border border-pink w-full  max-h-72 overflow-y-auto z-10 '>
							{options.map((option, index) => (
								<li
									key={index}
									className={`p-1 font-bayard text-2xl text-pink cursor-pointer hover:bg-pink  h-full hover:text-white s ${
										selectedValues.includes(option) ? 'bg-pink text-white' : ''
									}`}
									onClick={() => handleOptionClick(option)}
								>
									{option}
								</li>
							))}
						</ul>
					)}
				</div>
			) : type === 'select' ? (
				<div className='w-full h-full'>
					<input
						list={`${filter}-options`}
						id={filter}
						name={filter}
						defaultValue={defaultValue}
						className={`bg-transparent font-bayard text-xl uppercase border-2 border-pink p-5 w-full text-pink focus:outline-none focus:border-2 focus:border-pink h-full ${className}`}
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
					className={`bg-transparent font-bayard text-xl uppercase border-2 border-pink p-5 w-[94%] text-pink focus:outline-none focus:border-2 focus:border-pink h-full ${className}`}
					onChange={onChange}
					required={required}
				/>
			) : (
				<input
					type='text'
					id={filter}
					name={filter}
					defaultValue={defaultValue}
					placeholder={placeholder}
					className={`bg-transparent font-bayard text-xl uppercase border-2 border-pink p-5 w-full text-pink focus:outline-none focus:border-2 focus:border-pink m-auto h-full ${className}`}
					onChange={onChange}
					required={required}
				/>
			)}
		</>
	);
}
