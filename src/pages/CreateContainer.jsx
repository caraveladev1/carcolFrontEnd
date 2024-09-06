import React, { useState, useEffect } from 'react';
import { LabelGeneric } from '../components/LabelGeneric';
import { useTranslation } from 'react-i18next';
import { nameFilters, headersTableCreateContainer } from '../utils/consts';
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
					ico_id: item.ico_secondary_id === null ? item.ico_id : item.ico_id + ' / ' + item.ico_secondary_id,
					mark: item.mark,
					packaging_capacity: item.packaging_type + ' ' + item.packaging_capacity,
					units: item.units,
					sample: item.status_approval_sample === null ? 'Pending' : item.status_approval_sample,
					shipmentMonth: item.shipment_date,
					pricingConditions:
						item.pricing_conditions === 'differential' ? 'Differential: ' + item.fixation_flag : 'Fixed',
					select: false,
					destinationPorts: item.destination_port,
					exportCountry: item.origin,
					incoterm: item.incoterm,
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
		setFilteredIcoList((prevList) =>
			prevList.map((item) => (item.ico_id === ico_id ? { ...item, select: !item.select } : item)),
		);
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
		setFilteredIcoList(filteredList);
	}, [filters, icoList]);

	const preparedDataTable = filteredIcoList.map((item) => ({
		...item,
		select: <input type='checkbox' checked={item.select} onChange={() => handleCheckboxChange(item.ico_id)} />,
	}));

	if (loading) {
		return <Loader />;
	}

	return (
		<div className='bg-dark-background bg-cover bg-fixed'>
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-5xl font-bold uppercase text-pink font-bayard'>{t('createContainer')}</h1>
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
							/>
						</div>
					))}

					<SubmitButton className='bg-celeste col-span-2' typeButton='submit' />
				</div>
				<TableGeneric headersTable={headersTableCreateContainer} dataTable={preparedDataTable} />
			</section>
		</div>
	);
}
