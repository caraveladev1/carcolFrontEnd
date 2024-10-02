import React, { useEffect, useState } from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { headersTableView, viewContainerFilters } from '../utils/consts';
import { Loader } from '../components/Loader';
import editContainer from '../assets/img/editContainer.webp';
import { Link } from 'react-router-dom';
import { Filter } from '../components/Filter';

export function ViewContainers() {
	const { t } = useTranslation();
	const [organizedData, setOrganizedData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		office: '',
		exportMonth: '',
		packaging: '',
		contract: '',
		destination: '',
		shipmentMonth: '',
		finalDate: '',
	});

	const handleFilterChange = (filterName, value) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[filterName]: value,
		}));
	};

	// Función para organizar los datos por exp_id
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

	// Función para mapear los nombres de las propiedades
	const mapData = (data) => {
		return data.map((item) => ({
			contract: item.api_contract.main_identifier,
			customer: item.api_contract.customer,
			pricingConditions:
				item.api_contract.pricing_conditions === 'differential' && item.api_contract.fixation_flag === null
					? 'Differential: Pending '
					: item.api_contract.pricing_conditions === 'differential' && item.api_contract.fixation_flag !== null
						? 'Differential: Fixed '
						: 'Fixed',
			sample: item.api_contract.status_approval_sample ? item.api_contract.status_approval_sample : 'Pending',
			packaging: item.packaging_capacity,
			mark: item.brand_name,
			shipmentMonth: item.export_date,
			office: item.export_country,
			destination: item.destination_port,
			...item,
		}));
	};
	const filterData = (data) => {
		return Object.keys(data).reduce((filteredData, exp_id) => {
			const filteredItems = data[exp_id].filter((item) => {
				const itemShipmentMonth = new Date(item.shipmentMonth); // Convierte la fecha a objeto Date

				return (
					(!filters.office || item.office === filters.office) &&
					(!filters.shipmentMonth || itemShipmentMonth >= new Date(filters.shipmentMonth)) && // Fecha inicio
					(!filters.finalDate || itemShipmentMonth <= new Date(filters.finalDate)) && // Fecha final
					(!filters.packaging || item.packaging_capacity === filters.packaging) &&
					(!filters.contract || item.contract === filters.contract) &&
					(!filters.destination || item.destination === filters.destination)
				);
			});

			if (filteredItems.length > 0) {
				filteredData[exp_id] = filteredItems;
			}
			//console.log(filteredData);
			return filteredData;
		}, {});
	};

	useEffect(() => {
		const url = 'https://backcarcolback-atasc5b8a2gpckhm.eastus2-01.azurewebsites.net/api/exports/getAllContainers';
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const groupedData = groupByExpId(data);
				const mappedData = {};
				Object.keys(groupedData).forEach((exp_id) => {
					mappedData[exp_id] = mapData(groupedData[exp_id]);
				});

				setOrganizedData(mappedData);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return <Loader />;
	}

	const filteredData = filterData(organizedData);

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<h1 className='text-5xl font-bold my-8 uppercase text-yellow font-bayard'>{t('viewContainers')}</h1>

				{/* Renderizado de los filtros */}
				<div className='filtersContainer flex flex-row justify-between gap-6'>
					{viewContainerFilters.map((filterName) => {
						const isShipmentMonth = filterName === 'shipmentMonth' || filterName === 'finalDate';
						const options = !isShipmentMonth
							? [
									...new Set(
										Object.values(organizedData)
											.flat()
											.map((item) => item[filterName]),
									),
								]
							: [];

						return (
							<Filter
								key={filterName}
								placeholder={filterName}
								options={options}
								type={isShipmentMonth ? 'date' : 'select'}
								className='border-2 border-pink text-xl font-bayard uppercase text-pink'
								onChange={(e) => handleFilterChange(filterName, e.target.value)}
								value={filters[filterName]} // Asegúrate de pasar el valor actual del filtro
							/>
						);
					})}
				</div>

				{/* Renderización de los datos filtrados */}
				{filteredData &&
					Object.keys(filteredData).map((exp_id) => (
						<div key={exp_id} className='my-4 gap-6'>
							<div className='titleContainer flex flex-row justify-between  gap-10 items-center'>
								<div className='flex flex-row justify-between items-center gap-6'>
									<h2 className='text-3xl font-bold text-white font-bayard uppercase'>{exp_id}</h2>
									<Link to={`/edit-container/${exp_id}`}>
										<img className='max-w-[50%] ' src={editContainer} alt='Edit Container' />
									</Link>
								</div>
								<div className='flex flex-row justify-end gap-6 items-center'>
									<p className='text-3xl font-bold text-pink font-bayard uppercase'>
										{`Booking: ${filteredData[exp_id][0]?.booking || 'No available'}`}
									</p>
									<p className='text-3xl font-bold text-celeste font-bayard uppercase'>
										{`Landing on Port: ${filteredData[exp_id][0]?.date_landing || 'No available'}`}
									</p>
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
					))}
			</section>
		</div>
	);
}
