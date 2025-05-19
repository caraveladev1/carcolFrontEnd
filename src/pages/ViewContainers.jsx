import React, { useEffect, useState } from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { headersTableView, viewContainerFilters, API_BASE_URL } from '../utils/consts';
import { Loader } from '../components/Loader';
import editContainer from '../assets/img/editContainer.webp';
import { Link } from 'react-router-dom';
import { InputGeneric } from '../components/InputGeneric';
import commentsButton from '../assets/img/commentsButton.webp';
import { Comments } from '../components/Comments';
import { Announcements } from '../components/Announcements';
import { useRole } from '../Hooks/RoleContext.js';
export function ViewContainers() {
	const { t } = useTranslation();
	const role = useRole();
	const [organizedData, setOrganizedData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		office: [],
		exportMonth: [],
		packaging: [],
		contract: [],
		destination: [],
		initialDate: '',
		finalDate: '',
		ico: '',
	});

	const [officeOptions, setofficeOptions] = useState([]);
	const [packagingOptions, setPackagingOptions] = useState([]);
	const [contractOptions, setContractOptions] = useState([]);
	const [destinationOptions, setDestinationOptions] = useState([]);
	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const [selectedIco, setSelectedIco] = useState(null);
	const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
	const groupByExpId = (data) => {
		const result = {};
		Object.keys(data).forEach((key) => {
			const items = data[key];
			items.forEach((item) => {
				const { exp_id } = item;
				if (!result[exp_id]) {
					result[exp_id] = [];
				}
				result[exp_id].push(item);
			});
		});
		return result;
	};

	const handleCommentsButtonClick = (item) => {
		setSelectedIco(item.ico);
		setIsCommentsOpen(true);
	};

	const handleAnnouncementsButtonClick = (item) => {
		setSelectedIco(item.ico);
		setIsAnnouncementsOpen(true);
	};

	const closeComments = () => {
		setIsCommentsOpen(false);
		setSelectedIco(null);
	};

	const closeAnnouncements = () => {
		setIsAnnouncementsOpen(false);
		setSelectedIco(null);
	};

	const mapData = (data) => {
		return data.map((item) => ({
			...item,
			contract: item.contract_atlas.contract,
			customer: item.contract_atlas.customer,
			price_type:
				item.contract_atlas.price_type === 'differential' && item.contract_atlas.fixed_price_status === null
					? 'Differential: Pending '
					: item.contract_atlas.price_type === 'differential' && item.contract_atlas.fixed_price_status !== null
						? 'Differential: Fixed '
						: 'Fixed',
			sample: item.contract_atlas.customer_cupping_state || 'Pending',
			packaging: item.contract_atlas.packaging_type,
			mark: item.contract_atlas.mark,
			destinationPort: item.contract_atlas.destination_port,
			shipmentMonth: item.contract_atlas.shipment_date,
			weight: item.contract_atlas.estimated_kg,
			date_landing: item.date_landing,
			quality: item.contract_atlas.quality,
			production_order: item.contract_atlas.production_order || '-',
			milling_order: item.contract_atlas.milling_order || '-',
			milling_state: item.contract_atlas.milling_state || '-',
			export_date: item.export_date,
			units: item.contract_atlas.units,
			secondary_ico_id: item.contract_atlas.secondary_ico,
			comments: (
				<div className='flex flex-row justify-center items-center m-auto'>
					{item.comments}
					<button className='btn-class max-w-[20%]' onClick={() => handleCommentsButtonClick(item)}>
						<img src={commentsButton} alt='Comments' />
					</button>
				</div>
			),
			announcements:
				role === 'Admin' ? (
					<button className='btn-class bg-blue-500 text-white p-2' onClick={() => handleAnnouncementsButtonClick(item)}>
						Manage Announcements
					</button>
				) : null,
			office: item.export_country,
			destination: item.destination_port,
			originPort: item.origin_port,
		}));
	};

	const filterData = (data) => {
		return Object.keys(data).reduce((filteredData, exp_id) => {
			const filteredItems = data[exp_id].filter((item) => {
				const itemDate = new Date(item.date_landing);

				const withinDateRange =
					(!filters.initialDate || itemDate >= new Date(filters.initialDate)) &&
					(!filters.finalDate || itemDate <= new Date(filters.finalDate));

				const matchesOffice = filters.office.length === 0 || filters.office.includes(item.office);
				const matchesPackaging = filters.packaging.length === 0 || filters.packaging.includes(item.packaging);
				const matchesContract = filters.contract.length === 0 || filters.contract.includes(item.contract);
				const matchesDestination = filters.destination.length === 0 || filters.destination.includes(item.destination);
				const matchesIco = !filters.ico || item.ico?.toLowerCase().includes(filters.ico.toLowerCase());

				return (
					withinDateRange && matchesOffice && matchesPackaging && matchesContract && matchesDestination && matchesIco
				);
			});

			if (filteredItems.length > 0) {
				filteredData[exp_id] = filteredItems;
			}
			return filteredData;
		}, {});
	};

	useEffect(() => {
		const url = `${API_BASE_URL}api/exports/getAllContainers`;
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const groupedData = groupByExpId(data);
				let mappedData = {};

				// Mapear los datos y obtener la fecha mínima para cada grupo
				Object.keys(groupedData).forEach((exp_id) => {
					mappedData[exp_id] = mapData(groupedData[exp_id]);

					// Obtener la fecha mínima de date_landing en el grupo
					const minDateLanding =
						mappedData[exp_id]
							.filter((item) => item.date_landing)
							.map((item) => new Date(item.date_landing).getTime())
							.sort((a, b) => a - b)[0] || null;

					// Agregar la fecha mínima como propiedad para ordenar los grupos
					mappedData[exp_id].minDateLanding = minDateLanding;
				});

				// Ordenar los grupos por la fecha mínima
				mappedData = Object.fromEntries(
					Object.entries(mappedData).sort(([, a], [, b]) => {
						if (a.minDateLanding === null && b.minDateLanding === null) return 0;
						if (a.minDateLanding === null) return 1;
						if (b.minDateLanding === null) return -1;
						return a.minDateLanding - b.minDateLanding;
					}),
				);

				// Crear sets para las opciones únicas
				const office = new Set();
				const destination = new Set();
				const packaging = new Set();
				const contract = new Set();

				// Llenar los sets con datos únicos
				Object.values(mappedData).forEach((group) => {
					group.forEach((item) => {
						if (item.office) office.add(item.office);
						if (item.destination) destination.add(item.destination);
						if (item.packaging) packaging.add(item.packaging);
						if (item.contract) contract.add(item.contract);
					});
				});

				// Actualizar estados
				setofficeOptions(Array.from(office));
				setDestinationOptions(Array.from(destination));
				setPackagingOptions(Array.from(packaging));
				setContractOptions(Array.from(contract));
				setOrganizedData(mappedData);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoading(false);
			});
	}, []);

	//console.log(organizedData);
	const handleFilterChange = (e) => {
		const { name, value, multiple, selectedOptions } = e.target;

		const updatedValue = multiple ? [...selectedOptions].map((option) => option.value) : value;

		setFilters((prevFilters) => {
			const updatedFilters = {
				...prevFilters,
				[name]: name === 'initialDate' || name === 'finalDate' ? value : updatedValue,
			};
			//console.log('Updated Filters:', updatedFilters);
			return updatedFilters;
		});
	};

	if (loading) {
		return <Loader />;
	}

	const filteredData = filterData(organizedData);

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<h1 className='text-5xl font-bold my-8 uppercase text-yellow font-bayard'>{t('viewContainers')}</h1>

				<div className='filtersContainer flex flex-row justify-between gap-6'>
					<InputGeneric
						type='date'
						filter='initialDate'
						onChange={handleFilterChange}
						required={false}
						defaultValue={filters.initialDate}
					/>
					<InputGeneric
						type='date'
						filter='finalDate'
						onChange={handleFilterChange}
						required={false}
						defaultValue={filters.finalDate}
					/>
					<InputGeneric
						type='select'
						filter='office'
						onChange={handleFilterChange}
						required={false}
						defaultValue={filters.office}
						options={officeOptions}
						multiple={true}
					/>
					<InputGeneric
						type='select'
						filter='packaging'
						onChange={handleFilterChange}
						required={false}
						defaultValue={filters.packaging}
						options={packagingOptions}
						multiple={true}
					/>
					<InputGeneric
						type='select'
						filter='contract'
						onChange={handleFilterChange}
						required={false}
						defaultValue={filters.contract}
						options={contractOptions}
						multiple={true}
					/>
					<InputGeneric
						type='select'
						filter='destination'
						onChange={handleFilterChange}
						required={false}
						defaultValue={filters.destination}
						options={destinationOptions}
						multiple={true}
					/>
					<InputGeneric
						type='select'
						filter='ico'
						placeholder={t('ico_id')}
						onChange={handleFilterChange}
						required={false}
						defaultValue={filters.ico}
					/>
					{role === 'Admin' && (
						<button
							className='bg-pink font-bayard text-xl uppercase border-2 border-pink p-5 w-full text-white focus:outline-none focus:border-2 focus:border-pink text-start'
							type='button'
							value='Manage Announcements'
							onClick={() => setIsAnnouncementsOpen(true)}
						>
							Edit Announcements
						</button>
					)}
				</div>

				{filteredData &&
					Object.keys(filteredData).map((exp_id) => {
						const totalWeight = filteredData[exp_id].reduce((sum, item) => {
							const weight = parseFloat(item.weight) || 0;
							return sum + weight;
						}, 0);

						return (
							<div key={exp_id} className='my-4 gap-6'>
								<div className='titleContainer flex flex-row justify-between gap-10 items-center'>
									<div className='flex flex-row justify-between items-center gap-6'>
										<h2 className='text-3xl font-bold text-white font-bayard uppercase'>{exp_id}</h2>
										{role === 'Admin' && ( // Renderiza el enlace solo si el rol es '1'
											<Link to={`/edit-container/${exp_id}`}>
												<img className='max-w-[50%]' src={editContainer} alt='Edit Container' />
											</Link>
										)}
									</div>
									<div className='containerData flex flex-row gap-4'>
										<p className='text-xl font-bold text-pink font-bayard uppercase'>{`Total Weight (kg): ${totalWeight || 'No available'}`}</p>
										<p className='text-xl font-bold text-pink font-bayard uppercase'>{`Booking: ${filteredData[exp_id][0]?.booking || 'No available'}`}</p>
										<p className='text-xl font-bold text-celeste font-bayard uppercase'>{`Loading to Port: ${filteredData[exp_id][0]?.date_landing || 'No available'}`}</p>
									</div>
								</div>
								<div className='my-4'>
									<TableGeneric
										headersTable={headersTableView}
										dataTable={filteredData[exp_id]}
										renderRowContent={(row) => row}
									/>
								</div>
							</div>
						);
					})}

				{isCommentsOpen && <Comments ico={selectedIco} onClose={closeComments} />}
				{isAnnouncementsOpen && <Announcements ico={selectedIco} onClose={closeAnnouncements} />}
			</section>
		</div>
	);
}
