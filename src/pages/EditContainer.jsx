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
							? icoList[0]?.destination_port || ''
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
			weight: item.weight,
			export_country: item.export_country,
			select: false,
			is_pending: item.is_pending,
			comment_id: item.comment_id,
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
					const export_country = mappedData[0].export_country;
					setExportCountry(export_country);

					const exportsUrl = `${API_BASE_URL}api/exports/getAllExports`;
					const exportsResponse = await fetch(exportsUrl);
					const exportsData = await exportsResponse.json();
					setIcoList((prevIcoList) => {
						return prevIcoList.map((ico) => {
							const exportData = exportsData.find((exportItem) => exportItem.ico_id === ico.ico_id);
							//	console.log(exportData);
							return {
								...ico,
								weight: exportData ? exportData.estimated_kg : ico.weight || 0,
							};
						});
					});
					//console.log(exportsData);
					setExportsData(exportsData);
					//console.log(mappedData);
					const newFilters = {
						booking: mappedData[0].booking ? [mappedData[0].booking] : [],
						dateLandingPort: mappedData[0].date_landing ? [mappedData[0].date_landing] : [],
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
						weight: [...new Set(exportsData.map((item) => item.estimated_kg))],
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
	//console.log(icoList);
	//console.log(filters);
	//console.log(exportCountry);
	const handleIcoChange = (e) => {
		const selectedIcoId = e.target.value;

		const selectedIcoData = exportsData.find((item) => item.ico_id === selectedIcoId);

		if (selectedIcoData) {
			const transformedIcoData = {
				ico_id: selectedIcoData.ico_id,
				secondary_ico_id: selectedIcoData.ico_secondary_id,
				mark: selectedIcoData.mark,
				export_country: selectedIcoData.origin,
				packaging_capacity: `${selectedIcoData.packaging_type} ${selectedIcoData.packaging_capacity}`,
				units: selectedIcoData.units,
				sample: selectedIcoData.status_approval_sample === null ? 'Pending' : selectedIcoData.status_approval_sample,
				shipmentMonth: selectedIcoData.shipment_date,
				pricingConditions: selectedIcoData.pricing_conditions,
				weight: selectedIcoData.estimated_kg,
				select: false,
			};

			setIcoList((prevIcoList) => [...prevIcoList, transformedIcoData]);
		}
		//console.log(selectedIcoData);
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
		const sumIcosWeight = icoList.reduce((accumulator, element) => accumulator + parseInt(element.weight, 10), 0);
		const selectedContainer = parseInt(payload.filters.capacityContainer, 10);
		let selectedContainerValue;

		if (containerCapacity.hasOwnProperty(selectedContainer)) {
			selectedContainerValue = containerCapacity[selectedContainer];
		}

		// Verificar si el peso total de los ICOs no excede la capacidad del contenedor
		if (sumIcosWeight < selectedContainerValue) {
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
			window.alert('The total weight of the icos exceeds the capacity of the container.');
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
									onChange={(e) => {
										setFilterValues((prev) => ({
											...prev,
											[filter]: e.target.value,
										}));
										//console.log(`${filter} changed to ${e.target.value}`); // Debug
										if (filter === 'ico') handleIcoChange(e);
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
