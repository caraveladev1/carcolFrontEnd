import React, { useEffect, useState } from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { headersTablePending, API_BASE_URL } from '../utils/consts';
import { Loader } from '../components/Loader';
import { InputGeneric } from '../components/InputGeneric';

export function ExportedContainers() {
	const { t } = useTranslation();
	const [organizedData, setOrganizedData] = useState(null);
	const [loading, setLoading] = useState(true);

	// Estados para los filtros
	const [filters, setFilters] = useState({
		initialDate: '',
		finalDate: '',
		exportCountry: [],
		destinationPort: [],
	});

	// Opciones únicas para los filtros de tipo select
	const [countryOptions, setCountryOptions] = useState([]);
	const [portOptions, setPortOptions] = useState([]);

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

	const mapData = (data) => {
		return data.map((item) => ({
			contract: item.contract_atlas.contract,
			customer: item.contract_atlas.customer,
			price_type:
				item.contract_atlas.price_type === 'differential' && item.contract_atlas.fixed_price_status === null
					? 'Differential: Pending '
					: item.contract_atlas.price_type === 'differential' && item.contract_atlas.fixed_price_status !== null
						? 'Differential: Fixed '
						: 'Fixed',
			sample: item.contract_atlas.customer_cupping_state ? item.contract_atlas.customer_cupping_state : 'Pending',
			packaging: item.packaging_capacity,
			mark: item.brand_name,
			shipmentMonth: item.contract_atlas.shipment_date,
			destinationPort: item.contract_atlas.destination_port,
			destinationContainer: item.destination_port,
			weight: item.contract_atlas.estimated_kg,
			quality: item.contract_atlas.quality,
			origin: item.export_country,
			...item,
		}));
	};

	useEffect(() => {
		const url = `${API_BASE_URL}api/exports/getExportedContainers`;
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const groupedData = groupByExpId(data);
				const mappedData = {};
				Object.keys(groupedData).forEach((exp_id) => {
					mappedData[exp_id] = mapData(groupedData[exp_id]);
				});

				// Obtener opciones únicas para exportCountry y destinationPort
				const countries = new Set();
				const ports = new Set();

				Object.keys(mappedData).forEach((key) => {
					mappedData[key].forEach((item) => {
						countries.add(item.export_country);
						ports.add(item.destination_port);
					});
				});

				setCountryOptions(Array.from(countries));
				setPortOptions(Array.from(ports));

				setOrganizedData(mappedData);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoading(false);
			});
	}, []);

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: Array.isArray(value) ? value : [value], // Asegurarse de manejar arrays
		}));
	};

	// Filtrar los datos según los filtros seleccionados
	const filteredData = () => {
		if (!organizedData) return {};

		return Object.keys(organizedData).reduce((result, exp_id) => {
			const filteredItems = organizedData[exp_id].filter((item) => {
				const withinDateRange =
					(!filters.initialDate || new Date(item.date_landing) >= new Date(filters.initialDate)) &&
					(!filters.finalDate || new Date(item.date_landing) <= new Date(filters.finalDate));

				const matchesExportCountry = filters.exportCountry.length === 0 || filters.exportCountry.includes(item.origin);

				const matchesDestinationPort =
					filters.destinationPort.length === 0 ||
					(item.destinationContainer && filters.destinationPort.includes(item.destinationContainer));

				return withinDateRange && matchesExportCountry && matchesDestinationPort;
			});

			if (filteredItems.length > 0) {
				result[exp_id] = filteredItems;
			}
			return result;
		}, {});
	};
	//console.log(filters);
	if (loading) {
		return <Loader />;
	}
	//console.log(organizedData);
	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<h1 className='text-5xl font-bold my-8 uppercase text-beige font-bayard'>{t('exportedContainers')}</h1>

				{/* Filtros */}
				<div className='filters-container gap-6 flex flex-row '>
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
						filter='exportCountry'
						onChange={handleFilterChange}
						required={false}
						defaultValue={filters.exportCountry}
						options={countryOptions}
						multiple={true}
					/>
					<InputGeneric
						type='select'
						filter='destinationPort'
						onChange={handleFilterChange}
						required={false}
						defaultValue={filters.destinationPort}
						options={portOptions}
						multiple={true}
					/>
				</div>

				{Object.keys(filteredData()).map((exp_id) => (
					<div key={exp_id} className='my-4'>
						<div className='titleContainer flex flex-row justify-between items-center'>
							<h2 className='text-3xl font-bold text-white mb-4 font-bayard uppercase'>{exp_id}</h2>
						</div>

						<TableGeneric
							headersTable={headersTablePending}
							dataTable={filteredData()[exp_id]}
							renderRowContent={(row) => row}
						/>
					</div>
				))}
			</section>
		</div>
	);
}
