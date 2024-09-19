import React, { useEffect, useState } from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { headersTableView } from '../utils/consts';
import { Loader } from '../components/Loader';
import editContainer from '../assets/img/editContainer.webp';
import { Link } from 'react-router-dom';

export function ViewContainers() {
	const { t } = useTranslation();
	const [organizedData, setOrganizedData] = useState(null);
	const [loading, setLoading] = useState(true);

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
			...item,
		}));
	};

	useEffect(() => {
		const url = 'http://localhost:3000/api/exports/getAllContainers';
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const groupedData = groupByExpId(data);
				const mappedData = {};
				Object.keys(groupedData).forEach((exp_id) => {
					mappedData[exp_id] = mapData(groupedData[exp_id]);
				});

				setOrganizedData(mappedData);
				console.log(organizedData);
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
				<h1 className='text-5xl font-bold my-8 uppercase text-yellow font-bayard'>{t('viewContainers')}</h1>
				{/* organizedData contiene los datos agrupados */}
				{organizedData &&
					Object.keys(organizedData).map((exp_id) => (
						<div key={exp_id} className='my-4 gap-6'>
							<div className='titleContainer flex flex-row justify-between  gap-10 items-center'>
								<div className='flex flex-row justify-between items-center gap-6'>
									<h2 className='text-3xl font-bold text-white font-bayard uppercase'>{exp_id}</h2>
									<Link>
										<img className='max-w-[50%] ' src={editContainer} alt='Edit Container' />
									</Link>
								</div>
								<div className='flex flex-row justify-end gap-6 items-center'>
									<p className='text-3xl font-bold text-pink font-bayard uppercase'>
										{`Booking: ${organizedData[exp_id][0]?.booking || 'No available'}`}
									</p>
									<p className='text-3xl font-bold text-celeste font-bayard uppercase'>
										{`Landing on Port: ${organizedData[exp_id][0]?.date_landing || 'No available'}`}
									</p>
									<p className='text-3xl font-bold text-celeste font-bayard uppercase'>
										{`ETA: ${organizedData[exp_id][0]?.estimated_arrival || 'No available'}`}
									</p>
									<p className='text-3xl font-bold text-celeste font-bayard uppercase'>
										{`ETD: ${organizedData[exp_id][0]?.estimated_delivery || 'No available'}`}
									</p>
								</div>
							</div>

							<TableGeneric
								headersTable={headersTableView}
								dataTable={organizedData[exp_id]}
								renderRowContent={(row) => row}
							/>
						</div>
					))}
			</section>
		</div>
	);
}
