import { useState } from 'react';
import React from 'react';
import { filtersEditContainer, containerCapacity } from '../utils/consts';
import { LabelGeneric } from './LabelGeneric';
import { InputGeneric } from './InputGeneric';
import { SubmitButton } from './SubmitButton';
import { useTranslation } from 'react-i18next';
export function FiltersEditContainer({ filterValues, selectedIcos }) {
	const { t } = useTranslation();
	const selectedIcosData = selectedIcos;

	// Extraer valores por defecto y opciones
	const { containers: defaultValues, contract_atlas: optionValues } = filterValues;
	console.log(defaultValues);
	// Opciones dinámicas para los select
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
				: ['capacityContainer', 'port', 'incoterm', 'exportId', 'originPort'].includes(filter)
					? 'select'
					: 'text';
	// Definir valores por defecto para los filtros
	// Definir valores por defecto para los filtros, verificando si es null o undefined
	const defaultValuesFormatted = {
		booking: defaultValues[0]?.booking || `Enter ${t('booking')}`,
		dateLandingPort: defaultValues[0]?.date_landing || `Enter ${t('dateLandingPort')}`,
		capacityContainer: defaultValues[0]?.container_capacity
			? [defaultValues[0]?.container_capacity]
			: [`Enter ${t('capacityContainer')}`], // Comprobación para null
		estimatedArrival: defaultValues[0]?.estimated_arrival || `Enter ${t('estimatedArrival')}`,
		port: defaultValues[0]?.destination_port ? [defaultValues[0]?.destination_port] : [`Enter ${t('port')}`], // Comprobación para null
		originPort: defaultValues[0]?.origin_port ? [defaultValues[0]?.origin_port] : [`Enter ${t('originPort')}`], // Comprobación para null
		exportDate: defaultValues[0]?.export_date || `Enter ${t('exportDate')}`,
		incoterm: defaultValues[0]?.incoterm ? [defaultValues[0]?.incoterm] : [`Enter ${t('incoterm')}`], // Comprobación para null
		exportId: defaultValues[0]?.exp_id ? [defaultValues[0]?.exp_id] : [`Enter ${t('exportId')}`], // Comprobación para null
	};

	// Opciones dinámicas para los filtros
	// Opciones dinámicas para los filtros, incluyendo el valor por defecto
	const optionsByFilter = {
		capacityContainer: [defaultValues[0]?.container_capacity, ...containerLabels],
		port: [
			defaultValues[0]?.destination_port,
			...new Set(optionValues.map((option) => option.destination_port || 'N/A')),
		],
		originPort: [defaultValues[0]?.origin_port, ...new Set(optionValues.map((option) => option.origin_port || 'N/A'))],
		incoterm: [defaultValues[0]?.incoterm, ...new Set(optionValues.map((option) => option.incoterm || 'N/A'))],
		exportId: [defaultValues[0]?.exp_id, ...new Set(optionValues.map((option) => option.export || 'N/A'))],
	};

	// Filtros que admiten selección múltiple
	const multipleSelectFilters = ['capacityContainer', 'port', 'incoterm', 'exportId', 'originPort'];

	// Estado inicial
	const [flterValuesUpdated, setFlterValuesUpdated] = useState(defaultValuesFormatted);

	// Manejo de envío del formulario
	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = {
			icos: selectedIcosData,
			filters: flterValuesUpdated,
		};
		console.log('Payload:', payload);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='grid grid-cols-4 gap-4'>
				{filtersEditContainer.map((filter, index) => {
					const isMultiple = multipleSelectFilters.includes(filter);
					const defaultValue = flterValuesUpdated[filter]; // Valor por defecto del estado

					return (
						<div key={index} className='col-span-2 flex items-center gap-4'>
							<LabelGeneric filter={filter} />
							<InputGeneric
								type={inputType(filter)}
								filter={filter}
								defaultValue={defaultValue} // Pasar valor por defecto
								options={optionsByFilter[filter]} // Pasar opciones
								onChange={(e) => {
									// Actualizar estado al cambiar
									const updatedValues = {
										...flterValuesUpdated,
										[filter]: isMultiple ? e.target.value : e.target.value,
									};
									setFlterValuesUpdated(updatedValues);
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
