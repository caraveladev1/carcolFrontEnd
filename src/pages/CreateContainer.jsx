import React, { useState, useEffect } from 'react';
import { LabelGeneric } from '../components/LabelGeneric';
import { useTranslation } from 'react-i18next';
import { nameFilters, headersTableCreateContainer, containerCapacity, API_BASE_URL } from '../utils/consts';
import { Banner } from '../components/Banner';
import { InputGeneric } from '../components/InputGeneric';
import { Loader } from '../components/Loader';
import { SubmitButton } from '../components/SubmitButton';
import { TableGeneric } from '../components/TableGeneric';
import { useNavigate } from 'react-router-dom';

export function CreateContainer() {
	const navigate = useNavigate();
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
		originPort: [],
	});

	const [filters, setFilters] = useState({
		port: '',
		exportCountry: '',
		capacityContainer: '',
		incoterm: '',
		shipmentMonthStart: '',
		shipmentMonthFinal: '',
		originPort: '',
	});

	useEffect(() => {
		const url = `${API_BASE_URL}api/exports/getAllExports`;
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const shipmentPorts = [...new Set(data.map((item) => item.shipment_port))];
				const destinationPorts = [...new Set(data.map((item) => item.destination_port))];
				const exportCountry = [...new Set(data.map((item) => item.origin_iso))];
				const originPort = [...new Set(data.map((item) => item.origin_port))];
				const capacityContainer = [20, 40];
				const incoterm = [...new Set(data.map((item) => item.incoterm))];

				const updatedIcoList = data.map((item) => ({
					ico_id: item.ico,
					secondary_ico_id: item.secondary_ico,
					contract: item.contract,
					mark: item.mark,
					customer: item.customer,
					quality: item.quality,
					packaging_capacity: item.packaging_type,
					units: item.units,
					sample: item.customer_cupping_state === null ? 'Pending' : item.customer_cupping_state,
					shipmentMonth: item.shipment_date,
					price_type:
						item.price_type === 'differential' && item.fixed_price_status === null
							? 'Differential: Pending '
							: item.price_type === 'differential' && item.fixed_price_status !== null
								? 'Differential: Fixed '
								: 'Fixed',
					destinationPort: item.destination_port,
					exportCountry: item.origin_iso,
					incoterm: item.incoterm,
					production_order: item.production_order ? item.production_order : '-',
					milling_order: item.milling_order ? item.milling_order : '-',
					milling_state: item.milling_state ? item.milling_state : '-',
					weight: item.estimated_kg,
					originPort: item.origin_port,
				}));

				setIcoList(updatedIcoList);
				setFilteredIcoList(updatedIcoList);

				setSelectOptions({
					shipmentPorts,
					destinationPorts,
					exportCountry,
					capacityContainer,
					incoterm,
					originPort,
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
	///console.log(selectOptions);
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
				(filters.port === '' || item.destinationPort === filters.port) &&
				(filters.exportCountry === '' || item.exportCountry === filters.exportCountry) &&
				(filters.incoterm === '' || item.incoterm === filters.incoterm) &&
				(filters.shipmentMonthStart === '' || shipmentMonth >= shipmentMonthStart) &&
				(filters.shipmentMonthFinal === '' || shipmentMonth <= shipmentMonthFinal)
			);
		});
		// Combinar y ordenar: ítems seleccionados primero, luego los ítems filtrados
		setFilteredIcoList([
			...icoList.filter((item) => selectedIcos.has(item.ico_id)),
			...filteredList.filter((item) => !selectedIcos.has(item.ico_id)),
		]);
	}, [filters, icoList, selectedIcos]);

	const preparedDataTable = filteredIcoList.map((item) => ({
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
		console.log(payload);
		const sumIcosWeight = selectedData.reduce((accumulator, element) => accumulator + parseInt(element.weight, 10), 0);

		const selectedContainer = parseInt(payload.filters.capacityContainer, 10);
		let selectedContainerValue;

		if (containerCapacity.hasOwnProperty(selectedContainer)) {
			selectedContainerValue = containerCapacity[selectedContainer];
		}

		console.log(payload);

		if (sumIcosWeight < selectedContainerValue) {
			fetch(`${API_BASE_URL}api/exports/createContainer`, {
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
					navigate('/view-containers');
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
							<div key={filter} className='col-span-2 flex items-center gap-4 '>
								<LabelGeneric htmlFor={filter} filter={filter} />
								<InputGeneric
									type={
										filter === 'port' ||
										filter === 'capacityContainer' ||
										filter === 'exportCountry' ||
										filter === 'incoterm' ||
										filter === 'originPort'
											? 'select'
											: filter === 'shipmentMonthStart' || filter === 'shipmentMonthFinal'
												? 'date'
												: 'text'
									}
									filter={filter}
									name={filter}
									defaultValue={filters[filter]}
									options={
										filter === 'port'
											? selectOptions.destinationPorts
											: filter === 'exportCountry'
												? selectOptions.exportCountry
												: filter === 'capacityContainer'
													? selectOptions.capacityContainer
													: filter === 'incoterm'
														? selectOptions.incoterm
														: filter === 'originPort'
															? selectOptions.originPort
															: []
									}
									onChange={handleFilterChange}
									required={
										filter === 'port' ||
										filter === 'capacityContainer' ||
										filter === 'exportCountry' ||
										filter === 'incoterm' ||
										filter === 'originPort'
									}
								/>
							</div>
						))}
						<SubmitButton className='bg-celeste col-span-2' typeButton='submit' buttonText='submit' />
					</div>
				</form>
				<TableGeneric headersTable={headersTableCreateContainer} dataTable={preparedDataTable} />
			</section>
		</div>
	);
}
