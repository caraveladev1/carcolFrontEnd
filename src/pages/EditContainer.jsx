import React, { useState, useEffect } from 'react';
import { LabelGeneric } from '../components/LabelGeneric';
import { useTranslation } from 'react-i18next';
import { filtersEditContainer, headersTableEditContainer, containerCapacity } from '../utils/consts';
import { Banner } from '../components/Banner';
import { InputGeneric } from '../components/InputGeneric';
import { Loader } from '../components/Loader';
import { SubmitButton } from '../components/SubmitButton';
import { TableGeneric } from '../components/TableGeneric';
import { useParams } from 'react-router-dom';

export function EditContainer() {
	const { id } = useParams();
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [icoList, setIcoList] = useState([]);
	const [exportsData, setExportsData] = useState([]);
	const [selectedIcos, setSelectedIcos] = useState(new Set());
	const [filters, setFilters] = useState({
		booking: [],
		dateLoadingPort: [],
		estimatedDelivery: [],
		estimatedArrival: [],
		announcement: [],
		order: [],
		review: [],
		salesCode: [],
		exportDate: [],
		capacityContainer: [],
		exportCountry: [],
		port: [],
		incoterm: [],
		ico: [],
		exportId: [],
	});

	const mapApiResponseToHeaders = (apiResponse) => {
		return apiResponse.map((item) => ({
			ico_id: item.ico,
			secondary_ico_id: item.secondary_ico_id,
			mark: item.brand_name,
			packaging_capacity: item.packaging_capacity,
			units: item.units,
			sample:
				item.api_contract?.status_approval_sample === null ? 'Pending' : item.api_contract?.status_approval_sample,
			shipmentMonth: item.export_date,
			pricingConditions: item.api_contract?.pricing_conditions,
			booking: item.booking,
			date_landing: item.date_landing,
			estimated_delivery: item.estimated_delivery,
			estimated_arrival: item.estimated_arrival,
			announcement: item.announcement,
			review: item.review,
			sales_code: item.sales_code,
			container_capacity: item.container_capacity,
			destination_port: item.destination_port,
			incoterm: item.incoterm,
			orders: item.orders,
			select: false,
		}));
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const containersUrl = 'http://localhost:3000/api/exports/getAllContainers';
				const containersResponse = await fetch(containersUrl);
				const containersData = await containersResponse.json();
				const expFiltered = containersData[id];

				if (expFiltered) {
					const mappedData = mapApiResponseToHeaders(expFiltered);
					setIcoList(mappedData);

					const exportsUrl = 'http://localhost:3000/api/exports/getAllExports';
					const exportsResponse = await fetch(exportsUrl);
					const exportsData = await exportsResponse.json();
					setExportsData(exportsData);
					//console.log(mappedData[0]);
					const newFilters = {
						booking: mappedData[0].booking ? [mappedData[0].booking] : [],
						dateLoadingPort: mappedData[0].date_landing ? [mappedData[0].date_landing] : [],
						estimatedDelivery: mappedData[0].estimated_delivery ? [mappedData[0].estimated_delivery] : [],
						estimatedArrival: mappedData[0].estimated_arrival ? [mappedData[0].estimated_arrival] : [],
						announcement: mappedData[0].announcement ? [mappedData[0].announcement] : [],
						order: mappedData[0].orders ? [mappedData[0].orders] : [],
						review: mappedData[0].review ? [mappedData[0].review] : [],
						salesCode: mappedData[0].sales_code ? [mappedData[0].sales_code] : [],
						exportDate: mappedData[0].shipmentMonth ? [mappedData[0].shipmentMonth] : [],
						capacityContainer: Object.keys(containerCapacity).map(Number),
						exportId: [...new Set(exportsData.map((item) => item.export_number))],
						exportCountry: [...new Set(exportsData.map((item) => item.origin))],
						port: [...new Set(exportsData.map((item) => item.destination_port))],
						incoterm: [...new Set(exportsData.map((item) => item.incoterm))],
						ico: [...new Set(exportsData.map((item) => item.ico_id))],
					};

					setFilters(newFilters);
				}
			} catch (error) {
				console.error('Error fetching data: ', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);
	const handleIcoChange = (e) => {
		const selectedIcoId = e.target.value;

		const selectedIcoData = exportsData.find((item) => item.ico_id === selectedIcoId);

		if (selectedIcoData) {
			const transformedIcoData = {
				ico_id: selectedIcoData.ico_id,
				secondary_ico_id: selectedIcoData.ico_secondary_id,
				mark: selectedIcoData.mark,
				packaging_capacity: selectedIcoData.packaging_capacity,
				units: selectedIcoData.units,
				sample: selectedIcoData.status_approval_sample === null ? 'Pending' : selectedIcoData.status_approval_sample,
				shipmentMonth: selectedIcoData.shipment_date,
				pricingConditions: selectedIcoData.pricing_conditions,
				select: false,
			};

			setIcoList((prevIcoList) => [...prevIcoList, transformedIcoData]);
			//setSelectedIcos((prevSelected) => new Set(prevSelected).add(selectedIcoId));
		}

		//console.log(`Seleccionado ICO ID: ${selectedIcoId}`);
	};

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
	const handleDeleteSelected = () => {
		// Filtra la lista actual para remover los elementos seleccionados
		const updatedIcoList = icoList.filter((ico) => !selectedIcos.has(ico.ico_id));
		setIcoList(updatedIcoList);
		setSelectedIcos(new Set()); // Reiniciar la selección
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Filtrar solo los filtros seleccionados
		const filteredFilters = Object.fromEntries(
			Object.entries(filters).filter(([key, value]) => value), // Solo incluye el filtro si tiene un valor
		);

		// Payload con filtros seleccionados y todos los ICOs
		const payload = {
			filters: filteredFilters,
			selectedIcos: icoList, // Incluye todos los ICOs
		};

		const sumIcosWeight = icoList.reduce((accumulator, element) => accumulator + parseInt(element.weight, 10), 0);
		const selectedContainer = parseInt(payload.filters.capacityContainer, 10);
		let selectedContainerValue;

		if (containerCapacity.hasOwnProperty(selectedContainer)) {
			selectedContainerValue = containerCapacity[selectedContainer];
		}

		// Verificar si el peso total de los ICOs no excede la capacidad del contenedor
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
				<h1 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('editContainer')}</h1>
				<form onSubmit={handleSubmit}>
					<div className='grid grid-cols-4 gap-4'>
						{filtersEditContainer.map((filter) => (
							<div key={filter} className='col-span-2 flex items-center gap-4'>
								<LabelGeneric htmlFor={filter} filter={filter} className='col-span-1' />
								<InputGeneric
									type={
										filter === 'port' ||
										filter === 'capacityContainer' ||
										filter === 'exportCountry' ||
										filter === 'incoterm' ||
										filter === 'ico' ||
										filter === 'exportId'
											? 'select'
											: filter === 'booking' ||
													filter === 'announcement' ||
													filter === 'order' ||
													filter === 'review' ||
													filter === 'salesCode'
												? 'text'
												: filter === 'estimatedDelivery' ||
														filter === 'estimatedArrival' ||
														filter === 'exportDate' ||
														filter === 'dateLoadingPort'
													? 'date'
													: 'text'
									}
									filter={filter}
									name={filter}
									defaultValue={
										filter === 'capacityContainer'
											? icoList[0].container_capacity || ''
											: filter === 'port'
												? icoList[0].destination_port || ''
												: filter === 'incoterm'
													? icoList[0].incoterm || ''
													: filter === 'ico'
														? ''
														: filter === 'exportId'
															? ''
															: filters[filter] && filters[filter].length
																? filters[filter][0]
																: ''
									}
									className='col-span-3 p-2'
									options={
										filter === 'capacityContainer' ? Object.keys(containerCapacity).map(String) : filters[filter] || []
									}
									onChange={filter === 'ico' ? handleIcoChange : undefined}
								/>
							</div>
						))}
					</div>

					<div className='my-5 flex items-center justify-center gap-5'>
						<SubmitButton className={'bg-pink w-[60%] '} label={t('submit')} />
						<button
							type='button'
							className='bg-naranja font-bayard text-2xl text-white p-4 '
							onClick={handleDeleteSelected}
						>
							{t('deleteSelected')}
						</button>
					</div>

					<TableGeneric
						headersTable={headersTableEditContainer}
						dataTable={icoList.map((ico) => ({
							...ico,
							select: (
								<input
									type='checkbox'
									checked={selectedIcos.has(ico.ico_id)}
									onChange={() => handleCheckboxChange(ico.ico_id)}
								/>
							),
						}))}
					/>
				</form>
			</section>
		</div>
	);
}
