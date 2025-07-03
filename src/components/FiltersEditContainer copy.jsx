import { useState } from 'react';
import React from 'react';
import { filtersEditContainer, containerCapacity } from '../utils/consts';
import { LabelGeneric } from './LabelGeneric';
import { InputGeneric } from './InputGeneric';
import { SubmitButton } from './SubmitButton';

export function FiltersEditContainer({ filterValues, selectedIcos }) {
	const selectedIcosData = selectedIcos;

	// Extraer los valores predeterminados de containers[0]
	const defaultContainer = filterValues.containers?.[0] || {};

	const [flterValuesUpdated, setFlterValuesUpdated] = useState({
		booking: defaultContainer.booking || '',
		dateLandingPort: defaultContainer.date_landing || '',
		containerCapacity: [],
		estimatedArrival: defaultContainer.estimated_arrival || '',
		port: defaultContainer.destination_port || '',
		originPort: defaultContainer.origin_port || '',
		exportDate: defaultContainer.export_date || '',
		incoterm: defaultContainer.incoterm || '',
		exportId: defaultContainer.exp_id || '',
	});

	const { containers: defaultValues, contract_atlas: optionValues } = filterValues;

	const containerOptions = Object.entries(containerCapacity).map(([key, value]) => ({
		label: key,
		value,
	}));
	const containerLabels = containerOptions.map((option) => option.label);

	const inputType = (filter) =>
		filter === 'booking'
			? 'text'
			: ['dateLandingPort', 'estimatedArrival', 'exportDate'].includes(filter)
				? 'date'
				: ['containerCapacity', 'port', 'incoterm', 'exportId', 'originPort'].includes(filter)
					? 'select'
					: 'text';

	const optionsByFilter = {
		containerCapacity: containerLabels,
		port: [...new Set(optionValues.map((option) => option.destination_port || 'N/A'))],
		originPort: [...new Set(optionValues.map((option) => option.origin_port || 'N/A'))],
		incoterm: [...new Set(optionValues.map((option) => option.incoterm || 'N/A'))],
		exportId: [...new Set(optionValues.map((option) => option.export || 'N/A'))],
	};

	const multipleSelectFilters = ['containerCapacity', 'port', 'incoterm', 'exportId', 'originPort'];

	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = {
			icos: selectedIcosData,
			filters: flterValuesUpdated,
		};
		console.log('Submitted payload:', payload);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='grid grid-cols-4 gap-4'>
				{filtersEditContainer.map((filter, index) => {
					const isMultiple = multipleSelectFilters.includes(filter);
					const value = flterValuesUpdated[filter];

					return (
						<div key={index} className='col-span-2 flex items-center gap-4'>
							<LabelGeneric filter={filter} />
							<InputGeneric
								type={inputType(filter)}
								filter={filter}
								value={value} // Usar 'value' en lugar de 'defaultValue'
								options={optionsByFilter[filter] || []}
								onChange={(e) => {
									const updatedValue = isMultiple
										? [...e.target.selectedOptions].map((opt) => opt.value)
										: e.target.value;
									setFlterValuesUpdated((prev) => ({
										...prev,
										[filter]: updatedValue,
									}));
								}}
								placeholder={`Enter ${filter}`}
								multiple={isMultiple}
							/>
						</div>
					);
				})}
				<SubmitButton className='bg-celeste col-span-2' typeButton='submit' buttonText='submit' />
			</div>
		</form>
	);
}
