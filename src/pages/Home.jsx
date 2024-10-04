import React, { useEffect, useState } from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { headersTablePending, API_BASE_URL } from '../utils/consts';
import { Loader } from '../components/Loader';
import { BookingAndDates } from '../components/BookingAndDates';

export function Home() {
	const { t } = useTranslation();
	const [organizedData, setOrganizedData] = useState(null);
	const [expId, setExpId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showBookingAndDates, setShowBookingAndDates] = useState({});
	const [initialFormData, setInitialFormData] = useState({});

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
			...item,
		}));
	};

	useEffect(() => {
		const url = `${API_BASE_URL}api/exports/getPendingContainers`;
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

	// Función para manejar el click en el botón y mostrar/ocultar el componente BookingAndDates
	const toggleBookingAndDates = (exp_id) => {
		setShowBookingAndDates((prevState) => ({
			...prevState,
			[exp_id]: !prevState[exp_id],
		}));
		setInitialFormData((prevState) => ({
			...prevState,
			[exp_id]: {
				booking: organizedData[exp_id]?.[0].booking || undefined,
				exportDate: organizedData[exp_id]?.[0].export_date || undefined,
				dateLandingPort: organizedData[exp_id]?.[0].date_landing || undefined,
				estimatedDelivery: organizedData[exp_id]?.[0].estimated_delivery || undefined,
				estimatedArrival: organizedData[exp_id]?.[0].estimated_arrival || undefined,
				announcement: organizedData[exp_id]?.[0].announcement || undefined,
				order: organizedData[exp_id]?.[0].orders || undefined,
				review: organizedData[exp_id]?.[0].review || undefined,
				salesCode: organizedData[exp_id]?.[0].sales_code || undefined,
				exportId: organizedData[exp_id]?.[0].exp_id || undefined,
			},
		}));
	};

	useEffect(() => {
		const url = `${API_BASE_URL}api/exports/getAllExports`;
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const getExportNumber = data.map((item) => item.export_number);
				setExpId(getExportNumber);
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

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<h1 className='text-5xl font-bold my-8 uppercase text-yellow font-bayard'>{t('pendingTasks')}</h1>
				{/* organizedData contiene los datos agrupados */}
				{organizedData &&
					Object.keys(organizedData).map((exp_id) => (
						<div key={exp_id} className='my-4'>
							<div className='titleContainer flex flex-row justify-between items-center'>
								<h2 className='text-3xl font-bold text-white mb-4 font-bayard uppercase'>{exp_id}</h2>

								<button
									className='bg-yellow-500 text-celeste font-bayard uppercase text-3xl'
									onClick={() => toggleBookingAndDates(exp_id)}
								>
									{showBookingAndDates[exp_id] ? t('addBookingAndDates') : t('addBookingAndDates')}
								</button>
							</div>

							{showBookingAndDates[exp_id] && (
								<BookingAndDates
									exportNumber={exp_id}
									selectOptions={expId}
									required={'required'}
									initialFormData={initialFormData[exp_id]} // Pasa los datos al componente BookingAndDates
								/>
							)}
							<TableGeneric
								headersTable={headersTablePending}
								dataTable={organizedData[exp_id]}
								renderRowContent={(row) => row}
							/>
						</div>
					))}
			</section>
		</div>
	);
}
