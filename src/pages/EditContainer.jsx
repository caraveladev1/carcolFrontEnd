import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LabelGeneric } from '../components/LabelGeneric';
import { useTranslation } from 'react-i18next';
import { filtersEditContainer, headersTableEditContainer, containerCapacity, API_BASE_URL } from '../utils/consts';
import { Banner } from '../components/Banner';
import { InputGeneric } from '../components/InputGeneric';
import { Loader } from '../components/Loader';
import { SubmitButton } from '../components/SubmitButton';
import { TableGeneric } from '../components/TableGeneric';
import { useParams } from 'react-router-dom';
import { Announcements } from '../components/Announcements';

export function EditContainer() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [icoList, setIcoList] = useState([]);
	const [exportsData, setExportsData] = useState([]);
	const [selectedIcos, setSelectedIcos] = useState(new Set());
	const [exportCountry, setExportCountry] = useState([]);
	const [filterValues, setFilterValues] = useState({});
	const [filters, setFilters] = useState({
		booking: [],
		dateLandingPort: [],
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
	const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
	//console.log(selectedIcos);
	useEffect(() => {
		if (icoList.length > 0 && filters) {
			const defaultValues = {};
			filtersEditContainer.forEach((filter) => {
				defaultValues[filter] = filters[filter] && filters[filter].length ? filters[filter][0] : '';
			});
			setFilterValues(defaultValues);
		}
	}, [icoList, filters]);

	useEffect(() => {
		if (icoList.length > 0 && filters) {
			const defaultValues = {};
			filtersEditContainer.forEach((filter) => {
				defaultValues[filter] =
					filter === 'capacityContainer'
						? icoList[0]?.container_capacity || ''
						: filter === 'port'
							? icoList[0]?.destinationPortFilter || ''
							: filter === 'incoterm'
								? icoList[0]?.incoterm || ''
								: filter === 'exportId'
									? ''
									: filters[filter] && filters[filter].length
										? filters[filter][0]
										: '';
			});
			setFilterValues(defaultValues);
			//console.log(filterValues);
		}
	}, [icoList, filters]);

	const mapApiResponseToHeaders = (apiResponse) => {
		return apiResponse.map((item) => ({
			ico_id: item.ico,
			secondary_ico_id: item.secondary_ico_id,
			mark: item.brand_name,
			packaging_capacity: item.packaging_capacity,
			units: item.units,
			sample:
				item.contract_atlas?.customer_cupping_state === null ? 'Pending' : item.contract_atlas?.customer_cupping_state,
			shipmentMonth: item.contract_atlas?.shipment_date,
			price_type: item.contract_atlas?.price_type,
			booking: item.booking,
			date_landing: item.date_landing,
			export_date: item.export_date,
			estimated_delivery: item.estimated_delivery,
			estimated_arrival: item.estimated_arrival,
			announcement: item.announcement,
			review: item.review,
			sales_code: item.sales_code,
			container_capacity: item.container_capacity,
			destinationPort: item.contract_atlas.destination_port,
			destinationPortFilter: item.destination_port,
			incoterm: item.incoterm,
			orders: item.orders,
			weight: item.contract_atlas.estimated_kg,
			export_country: item.export_country,
			select: false,
			is_pending: item.is_pending,
			comment_id: item.comment_id,
			quality: item.contract_atlas.quality,
			is_exported: item.is_exported,
		}));
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const containersUrl = `${API_BASE_URL}api/exports/getAllContainers`;
				const containersResponse = await fetch(containersUrl);
				const containersData = await containersResponse.json();
				const expFiltered = containersData[id];

				if (expFiltered) {
					const mappedData = mapApiResponseToHeaders(expFiltered);
					setIcoList(mappedData);
					//	console.log(mappedData);
					const export_country = mappedData[0].export_country;
					setExportCountry(export_country);

					const exportsUrl = `${API_BASE_URL}api/exports/getAllExports`;
					const exportsResponse = await fetch(exportsUrl);
					const exportsData = await exportsResponse.json();

					setIcoList((prevIcoList) => {
						return prevIcoList.map((ico) => {
							const exportData = exportsData.find((exportItem) => exportItem.ico_id === ico.ico_id);
							return {
								...ico,
								weight: exportData ? exportData.estimated_kg : ico.weight || 0,
							};
						});
					});

					setExportsData(exportsData);

					const filteredIcos = exportsData.filter((ico) => ico.destination_port === filterValues.icosDestination);
					//console.log(filteredIcos);

					const newFilters = {
						booking: mappedData[0].booking ? [mappedData[0].booking] : [],
						dateLandingPort: mappedData[0].date_landing ? [mappedData[0].date_landing] : [],
						estimatedDelivery: mappedData[0].estimated_delivery ? [mappedData[0].estimated_delivery] : [],
						estimatedArrival: mappedData[0].estimated_arrival ? [mappedData[0].estimated_arrival] : [],
						announcement: mappedData[0].announcement ? [mappedData[0].announcement] : [],
						order: mappedData[0].orders ? [mappedData[0].orders] : [],
						review: mappedData[0].review ? [mappedData[0].review] : [],
						salesCode: mappedData[0].sales_code ? [mappedData[0].sales_code] : [],
						exportDate: mappedData[0].export_date ? [mappedData[0].export_date] : [],
						capacityContainer: Object.keys(containerCapacity).map(Number),
						exportId: [...new Set(exportsData.map((item) => item.export))],
						exportCountry: [...new Set(exportsData.map((item) => item.origin))],
						port: [...new Set(exportsData.map((item) => item.destination_port))],
						incoterm: [...new Set(exportsData.map((item) => item.incoterm))],
						ico: [...new Set(filteredIcos.map((item) => item.ico))],
						weight: [...new Set(exportsData.map((item) => item.estimated_kg))],
						icosDestination: [...new Set(exportsData.map((item) => item.destination_port))],
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
	}, [id /* , filterValues.icosDestination */]);

	const handleIcoChange = (e) => {
		const selectedIco = e.target.value;

		const selectedIcoData = exportsData.find((item) => String(item.ico) === String(selectedIco));

		if (selectedIcoData) {
			const transformedIcoData = {
				shipmentMonth: selectedIcoData.shipment_date,
				ico_id: selectedIcoData.ico,
				secondary_ico_id: selectedIcoData.secondary_ico,
				mark: selectedIcoData.mark,
				export_country: selectedIcoData.origin_iso,
				packaging_capacity: selectedIcoData.packaging_type,
				units: selectedIcoData.units,
				sample: selectedIcoData.fixed_price_status === null ? 'Pending' : selectedIcoData.fixed_price_status,
				price_type: selectedIcoData.price_type,
				destinationPort: selectedIcoData.destination_port,
				weight: selectedIcoData.estimated_kg,
				quality: selectedIcoData.quality,
				select: false,
			};

			setIcoList((prevIcoList) => {
				if (prevIcoList.some((ico) => ico.ico_id === selectedIco)) {
					return prevIcoList;
				}
				return [...prevIcoList, transformedIcoData];
			});
		} else {
			console.log('No se encontró el ICO con id:', selectedIco);
		}
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
		const updatedIcoList = icoList.filter((ico) => !selectedIcos.has(ico.ico_id));
		setIcoList(updatedIcoList);
		setSelectedIcos(new Set());
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = {
			old_id: id,
			export_country: exportCountry,
			filters: filterValues,
			selectedIcos: icoList,
		};

		//console.log(payload);

		const sumIcosWeight = payload.selectedIcos.reduce((accumulator, element) => {
			const weight = parseInt(element.weight, 10);
			return accumulator + (isNaN(weight) ? 0 : weight);
		}, 0);

		const selectedContainer = parseInt(payload.filters.capacityContainer, 10);
		let selectedContainerValue;

		if (containerCapacity.hasOwnProperty(selectedContainer)) {
			selectedContainerValue = containerCapacity[selectedContainer];
		} else {
			window.alert('Invalid container capacity selected.');
			return;
		}

		//console.log('Sum of ICO weights:', sumIcosWeight);
		//	console.log('Selected container capacity:', selectedContainerValue);

		if (sumIcosWeight <= selectedContainerValue) {
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
		} else {
			window.alert('The total weight of the ICOs exceeds the capacity of the container.');
			return;
		}
	};

	const openAnnouncements = () => {
		setIsAnnouncementsOpen(true);
	};

	const closeAnnouncements = () => {
		setIsAnnouncementsOpen(false);
	};
	if (loading) {
		return <Loader />;
	}

	function setExported() {
		try {
			const apiSetExported = `${API_BASE_URL}api/exports/setExported`;

			fetch(apiSetExported, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: id,
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
	}
	//(filterValues);
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
										filter === 'ico' || // Aseguramos que sea tipo select
										filter === 'exportId' ||
										filter === 'icosDestination'
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
														filter === 'dateLandingPort'
													? 'date'
													: 'text'
									}
									filter={filter}
									name={filter}
									defaultValue={
										filter === 'capacityContainer'
											? icoList[0].container_capacity || ''
											: filter === 'port'
												? icoList[0].destinationPortFilter || ''
												: filter === 'incoterm'
													? icoList[0].incoterm || ''
													: filter === 'ico'
														? '' // Se establece vacío inicialmente para que el usuario seleccione
														: filter === 'exportId'
															? ''
															: filter === 'icosDestination'
																? ''
																: filters[filter] && filters[filter].length
																	? filters[filter][0]
																	: ''
									}
									//className='col-span-3 p-2'
									options={
										filter === 'capacityContainer'
											? Object.keys(containerCapacity).map(String)
											: filter === 'ico'
												? filters['ico'] // Los valores del filtro `ico`
												: filter === 'icosDestination'
													? filters['icosDestination'] // Los valores del filtro `icosDestination`
													: filters[filter] || []
									}
									onChange={(e) => {
										setFilterValues((prev) => ({
											...prev,
											[filter]: e.target.value,
										}));
										if (filter === 'ico') handleIcoChange(e);
										if (filter === 'icosDestination') {
											const selectedDestination = e.target.value;

											// Filtrar los valores de `ico` en base al destino seleccionado
											const filteredIcos = exportsData
												.filter((item) => item.destination_port === selectedDestination)
												.map((item) => item.ico);

											setFilters((prevFilters) => ({
												...prevFilters,
												ico: [...new Set(filteredIcos)], // Actualizamos el filtro `ico`
											}));
										}
									}}
								/>
							</div>
						))}
					</div>

					<div className='my-5 flex items-center justify-center gap-5'>
						<SubmitButton className='bg-pink w-[60%] ' buttonText='submit' />
						<button
							type='button'
							className='bg-naranja font-bayard text-2xl text-white p-4 '
							onClick={handleDeleteSelected}
						>
							{t('deleteSelected')}
						</button>
						<button
							type='button'
							className='bg-morado font-bayard text-2xl text-white p-4 '
							onClick={openAnnouncements}
						>
							{t('addAnnouncements')}
						</button>
						<button type='button' className='bg-yellow font-bayard text-2xl text-white p-4 ' onClick={setExported}>
							{t('setExported')}
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
				{isAnnouncementsOpen && <Announcements onClose={closeAnnouncements} ico={icoList} />}
			</section>
		</div>
	);
}
