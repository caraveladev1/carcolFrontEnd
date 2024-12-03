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
				: ['containerCapacity', 'port', 'incoterm', 'exportId', 'originPort'].includes(filter)
					? 'select'
					: 'text';
	// Definir valores por defecto para los filtros
	const defaultValuesFormatted = {
		booking: defaultValues[0]?.booking || `Enter ${t('booking')}`,
		dateLandingPort: defaultValues[0]?.date_landing || `Enter ${t('booking')}`,
		containerCapacity: [defaultValues[0]?.container_capacity || `Enter ${t('dateLandingPort')}`], // Array para múltiples selecciones
		estimatedArrival: defaultValues[0]?.estimated_arrival || `Enter ${t('estimatedArrival')}`,
		port: [defaultValues[0]?.destination_port] || `Enter ${t('port')}`, // Array para múltiples selecciones
		originPort: [defaultValues[0]?.origin_port] || `Enter ${t('originPort')}`, // Array para múltiples selecciones
		exportDate: defaultValues[0]?.export_date || `Enter ${t('exportDate')}`,
		incoterm: [defaultValues[0]?.incoterm] || `Enter ${t('incoterm')}`, // Array para múltiples selecciones
		exportId: [defaultValues[0]?.exp_id] || `Enter ${t('exportId')}`, // Array para múltiples selecciones
	};

	// Opciones dinámicas para los filtros
	const optionsByFilter = {
		capacityContainer: containerLabels,
		port: [...new Set(optionValues.map((option) => option.destination_port || 'N/A'))],
		originPort: [...new Set(optionValues.map((option) => option.origin_port || 'N/A'))],
		incoterm: [...new Set(optionValues.map((option) => option.incoterm || 'N/A'))],
		exportId: [...new Set(optionValues.map((option) => option.export || 'N/A'))],
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
