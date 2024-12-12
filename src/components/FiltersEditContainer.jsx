import { useState } from 'react';
import React from 'react';
import { filtersEditContainer, containerCapacity, API_BASE_URL } from '../utils/consts';
import { LabelGeneric } from './LabelGeneric';
import { InputGeneric } from './InputGeneric';
import { SubmitButton } from './SubmitButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
export function FiltersEditContainer({ filterValues, selectedIcos, oldExportId }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const selectedIcosData = selectedIcos;
	const oldExportIdData = oldExportId;
	// Extraer valores por defecto y opciones
	const { containers: defaultValues, contract_atlas: optionValues } = filterValues;
	//	console.log(defaultValues);
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

	const defaultValuesFormatted = {
		booking: defaultValues[0]?.booking,
		dateLandingPort: defaultValues[0]?.date_landing,
		capacityContainer: [defaultValues[0]?.container_capacity], // Comprobación para null
		estimatedArrival: defaultValues[0]?.estimated_arrival,
		port: [defaultValues[0]?.destination_port], // Comprobación para null
		originPort: [defaultValues[0]?.origin_port], // Comprobación para null
		exportDate: defaultValues[0]?.export_date,
		incoterm: [defaultValues[0]?.incoterm], // Comprobación para null
		exportId: [defaultValues[0]?.exp_id], // Comprobación para null
	};

	const optionsByFilter = {
		capacityContainer: [/* defaultValues[0]?.container_capacity, */ ...containerLabels],
		port: [optionValues?.destination_port, ...new Set(optionValues.map((option) => option.destination_port || 'N/A'))],
		originPort: [optionValues?.origin_port, ...new Set(optionValues.map((option) => option.origin_port || 'N/A'))],
		incoterm: [optionValues?.incoterm, ...new Set(optionValues.map((option) => option.incoterm || 'N/A'))],
		exportId: [
			...new Set(
				// Usamos Set para eliminar duplicados
				defaultValues
					?.map((item) => item?.contract_atlas?.export)
					.filter(Boolean), // Extraemos export y filtramos los valores nulos/undefined
			),
		],
	};

	// Filtros que admiten selección múltiple
	const multipleSelectFilters = ['capacityContainer', 'port', 'incoterm', 'originPort'];

	// Estado inicial
	const [flterValuesUpdated, setFlterValuesUpdated] = useState(defaultValuesFormatted);
	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = {
			old_id: oldExportIdData,
			states: defaultValues,
			selectedIcos: selectedIcosData,
			filters: Object.fromEntries(
				Object.entries(flterValuesUpdated).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
			),
		};

		console.log('Payload completo:', payload);

		// Verificar si defaultValues[0].is_pending === '1'
		if (defaultValues[0]?.is_pending === '1') {
			// Crear un nuevo payload con solo los campos requeridos
			const limitedPayload = {
				old_id: oldExportIdData,
				filters: {
					exportDate: flterValuesUpdated.exportDate,
					estimatedArrival: flterValuesUpdated.estimatedArrival,
				},
			};

			//	console.log('Payload reducido:', limitedPayload);

			// Enviar los datos limitados al servidor
			fetch(`${API_BASE_URL}api/exports/updateContainerAfterLoaded`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(limitedPayload),
			})
				.then((response) => {
					if (
						(!response.ok && limitedPayload.filters.exportDate === null) ||
						limitedPayload.filters.estimatedArrival === null
					) {
						window.alert(
							'The container is loaded, you only update "Estimated Arrival" and "Export date". Please fill in the required fields',
						);
						throw new error();
					}
					return response.json();
				})
				.then(() => {
					window.alert(
						'Container updated successfully. \n\nPlease noted: The container is loaded, only going to be updated "Estimated Arrival" and "Export date" fields.',
					);
					navigate('/view-containers');
				})
				.catch((error) => {
					console.error('Error:', error);
				});

			return;
		}

		// Sumar pesos de los ICOs
		const sumIcosWeight = payload.selectedIcos.reduce((accumulator, element) => {
			const weight = parseInt(element.weight, 10);
			return accumulator + (isNaN(weight) ? 0 : weight);
		}, 0);

		const selectedContainerKey = payload.filters.capacityContainer;
		const selectedContainerValue = containerCapacity[selectedContainerKey];

		if (!selectedContainerValue) {
			window.alert('Invalid container capacity selected.');
			return;
		}

		// Verificar si el peso total excede la capacidad
		if (sumIcosWeight > selectedContainerValue) {
			window.alert('The total weight of the ICOs exceeds the capacity of the container.');
			return;
		}

		// Proceder con el envío de datos completos si la validación pasa
		fetch(`${API_BASE_URL}api/exports/updateContainer`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(() => {
				window.alert('Container created successfully');
				navigate('/view-containers');
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	function setExported() {
		if (defaultValues[0].is_pending === '1') {
			try {
				const apiSetExported = `${API_BASE_URL}api/exports/setExported`;

				fetch(apiSetExported, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: oldExportIdData,
						is_exported: '1',
					}),
				})
					.then((response) => response.json())

					.catch((error) => {
						console.error('Error:', error);
					});

				window.alert('Container set as exported successfully');
				navigate('/view-containers');
			} catch (error) {
				console.log(error);
			}
		} else {
			window.alert('Container is not loaded');
		}
	}
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
				<SubmitButton className='bg-celeste col-span-1' typeButton='submit' buttonText='submit' />
				<SubmitButton
					className='bg-pink col-span-1'
					typeButton='button'
					buttonText='setExported'
					onClick={setExported}
				/>
			</div>
		</form>
	);
}
