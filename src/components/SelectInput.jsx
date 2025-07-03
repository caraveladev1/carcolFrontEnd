import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

export function SelectInput({
	name,
	control,
	options = [],
	placeholder,
	isMulti = false,
	isSearchable = true,
	required = false,
	rules = {},
	...props
}) {
	const { t } = useTranslation();

	const customStyles = {
		control: (provided) => ({
			...provided,
			backgroundColor: 'transparent',
			border: '2px solid #e91e63',
			borderRadius: 0,
			padding: '8px',
			minHeight: '56px',
			height: '100%',
			width: '100%',
			minWidth: 0,
			flex: 1,
			fontFamily: 'bayard',
			fontSize: '20px',
			textTransform: 'uppercase',
			color: '#e91e63',
			'&:hover': {
				borderColor: '#e91e63',
			},
			'&:focus-within': {
				borderColor: '#e91e63',
				boxShadow: 'none',
			},
		}),
		placeholder: (provided) => ({
			...provided,
			color: '#e91e63',
			opacity: 0.7,
		}),
		singleValue: (provided) => ({
			...provided,
			color: '#e91e63',
		}),
		multiValue: (provided) => ({
			...provided,
			backgroundColor: '#e91e63',
			color: 'white',
		}),
		multiValueLabel: (provided) => ({
			...provided,
			color: 'white',
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected ? '#e91e63' : state.isFocused ? '#f8bbd9' : 'white',
			color: state.isSelected ? 'white' : '#e91e63',
			fontFamily: 'bayard',
			fontSize: '18px',
			textTransform: 'uppercase',
		}),
	};

	const formatOptions = (opts) => {
		if (!Array.isArray(opts)) return [];
		return opts.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
	};

	return (
		<div className='w-full min-w-0 h-full'>
			<Controller
				name={name}
				control={control}
				rules={{ required: required && `${name} is required`, ...rules }}
				render={({ field, fieldState: { error } }) => (
					<>
						<Select
							{...field}
							{...props}
							options={formatOptions(options)}
							isMulti={isMulti}
							isSearchable={isSearchable}
							placeholder={placeholder || `Select ${t(name)}`}
							styles={customStyles}
							value={
								isMulti
									? formatOptions(options).filter((opt) => field.value?.includes(opt?.value))
									: formatOptions(options).find((opt) => opt?.value === field.value) || null
							}
							onChange={(selected) => {
								if (isMulti) {
									field.onChange(selected ? selected.map((s) => s.value) : []);
								} else {
									field.onChange(selected ? selected.value : '');
								}
							}}
						/>
						{error && <span className='text-red-500 text-sm'>{error.message}</span>}
					</>
				)}
			/>
		</div>
	);
}
