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
		control: (provided, state) => ({
			...provided,
			backgroundColor: 'transparent',
			border: '2px solid #E0B2B9',
			borderRadius: 0,
			padding: '8px',
			minHeight: '60px',
			height: '100%',
			width: '100%',
			display: 'flex',
			alignItems: 'stretch',
			fontFamily: 'itf',
			fontSize: '18px',
			textTransform: 'uppercase',
			color: '#E0B2B9',
			'&:hover': {
				borderColor: '#E0B2B9',
			},
			'&:focus-within': {
				borderColor: '#E0B2B9',
				boxShadow: 'none',
			},
		}),
		placeholder: (provided) => ({
			...provided,
			color: '#E0B2B9',
			opacity: 0.7,
		}),
		singleValue: (provided) => ({
			...provided,
			color: '#E0B2B9',
		}),
		multiValue: (provided) => ({
			...provided,
			backgroundColor: '#E0B2B9',
			color: 'white',
		}),
		multiValueLabel: (provided) => ({
			...provided,
			color: 'white',
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected ? '#E0B2B9' : state.isFocused ? '#482E20' : 'white',
			color: state.isSelected ? 'white' : '#E0B2B9',
			fontFamily: 'itf',
			fontSize: '18px',
			textTransform: 'uppercase',
		}),
	};

	const formatOptions = (opts) => {
		if (!Array.isArray(opts)) return [];
		return opts.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
	};

	return (
		<Controller
			name={name}
			control={control}
			rules={{ required: required && `${name} is required`, ...rules }}
			render={({ field, fieldState: { error } }) => (
				<div className='w-full min-w-0 h-full min-h-[60px]'>
					{error && <span className='text-red-500 text-sm block mb-1'>{error.message}</span>}
					<div className='flex'>
						<Select
							{...field}
							{...props}
							options={formatOptions(options)}
							isMulti={isMulti}
							isSearchable={isSearchable}
							isClearable={true}
							placeholder={placeholder || `Select ${t(name)}`}
							className='flex-1'
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
					</div>
				</div>
			)}
		/>
	);
}
