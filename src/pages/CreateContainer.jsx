import React, { useState, useEffect } from 'react';
import { LabelGeneric } from '../components/LabelGeneric';
import { useTranslation } from 'react-i18next';
import { nameFilters, headersTableCreateContainer, containerCapacity } from '../utils/consts';
import { Banner } from '../components/Banner';
import { InputGeneric } from '../components/InputGeneric';
import { Loader } from '../components/Loader';
import { SubmitButton } from '../components/SubmitButton';
import { TableGeneric } from '../components/TableGeneric';

export function CreateContainer() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [icoList, setIcoList] = useState([]);
	const [filteredIcoList, setFilteredIcoList] = useState([]);
	const [selectedIcos, setSelectedIcos] = useState(new Set());

	const [selectOptions, setSelectOptions] = useState({
		shipmentPorts: [],
		destinationPorts: [],
		exportCountry: [],
		capacityContainer: [],
		incoterm: [],
	});

	const [filters, setFilters] = useState({
		port: '',
		exportCountry: '',
		capacityContainer: '',
		incoterm: '',
		shipmentMonthStart: '',
		shipmentMonthFinal: '',
	});

	useEffect(() => {
		const url = 'http://localhost:3000/api/exports/getAllExports';
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const shipmentPorts = [...new Set(data.map((item) => item.shipment_port))];
				const destinationPorts = [...new Set(data.map((item) => item.destination_port))];
				const exportCountry = [...new Set(data.map((item) => item.origin))];
				const capacityContainer = [20, 40];
				const incoterm = [...new Set(data.map((item) => item.incoterm))];

				const updatedIcoList = data.map((item) => ({
					ico_id: item.ico_id,
					secondary_ico_id: item.ico_secondary_id,
					mark: item.mark,
					packaging_capacity: `${item.packaging_type} ${item.packaging_capacity}`,
					units: item.units,
					sample: item.status_approval_sample === null ? 'Pending' : item.status_approval_sample,
					shipmentMonth: item.shipment_date,
					pricingConditions:
						item.pricing_conditions === 'differential' && item.fixation_flag === null
							? 'Differential: Pending '
							: item.pricing_conditions === 'differential' && item.fixation_flag !== null
								? 'Differential: Fixed '
								: 'Fixed',
					destinationPorts: item.destination_port,
					exportCountry: item.origin,
					incoterm: item.incoterm,
					weight: item.estimated_kg,
				}));

				setIcoList(updatedIcoList);
				setFilteredIcoList(updatedIcoList);

				setSelectOptions({
					shipmentPorts,
					destinationPorts,
					exportCountry,
					capacityContainer,
					incoterm,
				});
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoading(false);
			});
	}, []);

	const handleCheckboxChange = (ico_id) => {
		setSelectedIcos((prevSelectedIcos) => {
			const newSelectedIcos = new Set(prevSelectedIcos);
			if (newSelectedIcos.has(ico_id)) {
				newSelectedIcos.delete(ico_id);
			} else {
				newSelectedIcos.add(ico_id);
			}
			return newSelectedIcos;
		});
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
	};

	useEffect(() => {
		const filteredList = icoList.filter((item) => {
			const shipmentMonth = new Date(item.shipmentMonth);
			const shipmentMonthStart = new Date(filters.shipmentMonthStart);
			const shipmentMonthFinal = new Date(filters.shipmentMonthFinal);

			return (
				(filters.port === '' || item.destinationPorts === filters.port) &&
				(filters.exportCountry === '' || item.exportCountry === filters.exportCountry) &&
				(filters.incoterm === '' || item.incoterm === filters.incoterm) &&
				(filters.shipmentMonthStart === '' || shipmentMonth >= shipmentMonthStart) &&
				(filters.shipmentMonthFinal === '' || shipmentMonth <= shipmentMonthFinal)
			);
		});

		// Combinar y ordenar: ítems seleccionados primero, luego los ítems filtrados
		const combinedList = [
			...icoList.filter(
				(item) =>
					selectedIcos.has(item.ico_id) && !filteredList.some((filteredItem) => filteredItem.ico_id === item.ico_id),
			),
			...filteredList,
		];

		setFilteredIcoList(combinedList);
	}, [filters, icoList, selectedIcos]);

	const preparedDataTable = icoList.map((item) => ({
		...item,
		select: (
			<input
				type='checkbox'
				checked={selectedIcos.has(item.ico_id)}
				onChange={() => handleCheckboxChange(item.ico_id)}
			/>
		),
	}));

	const handleSubmit = (e) => {
		e.preventDefault();
		const selectedData = icoList.filter((ico) => selectedIcos.has(ico.ico_id));

		const payload = {
			filters,
			selectedIcos: selectedData,
		};

		const sumIcosWeight = selectedData.reduce((accumulator, element) => accumulator + parseInt(element.weight, 10), 0);

		const selectedContainer = parseInt(payload.filters.capacityContainer, 10);
		let selectedContainerValue;

		if (containerCapacity.hasOwnProperty(selectedContainer)) {
			selectedContainerValue = containerCapacity[selectedContainer];
		}

		//console.log(payload);

		if (sumIcosWeight < selectedContainerValue) {
			fetch('http://localhost:3000/api/exports/createContainer', {
				method: 'POST',
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
					window.location.reload();
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		} else {
			window.alert('The total weight of the icos exceeds the capacity of the container.');
			return;
		}
	};
	if (loading) {
		return <Loader />;
	}

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-5xl font-bold uppercase text-pink font-bayard'>{t('createContainer')}</h1>
				<form onSubmit={handleSubmit}>
					<div className='grid grid-cols-4 gap-4'>
						{nameFilters.map((filter) => (
							<div key={filter} className='col-span-2 flex items-center gap-4'>
								<LabelGeneric htmlFor={filter} filter={filter} className='col-span-1' />
								<InputGeneric
									type={
										filter === 'port' ||
										filter === 'capacityContainer' ||
										filter === 'exportCountry' ||
										filter === 'incoterm'
											? 'select'
											: filter === 'shipmentMonthStart' || filter === 'shipmentMonthFinal'
												? 'date'
												: 'text'
									}
									filter={filter}
									name={filter}
									defaultValue={filters[filter]}
									className='col-span-3 p-2'
									options={
										filter === 'port'
											? selectOptions.destinationPorts
											: filter === 'exportCountry'
												? selectOptions.exportCountry
												: filter === 'capacityContainer'
													? selectOptions.capacityContainer
													: filter === 'incoterm'
														? selectOptions.incoterm
														: []
									}
									onChange={handleFilterChange}
									required={
										filter === 'port' ||
										filter === 'capacityContainer' ||
										filter === 'exportCountry' ||
										filter === 'incoterm'
									}
								/>
							</div>
						))}
						<SubmitButton className='bg-celeste col-span-2' typeButton='submit' />
					</div>
				</form>
				<TableGeneric headersTable={headersTableCreateContainer} dataTable={preparedDataTable} />
			</section>
		</div>
	);
}
