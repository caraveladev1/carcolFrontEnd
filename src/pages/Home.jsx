import React, { useEffect, useState } from 'react';
import { Banner } from '../components/Banner';
import { Filter } from '../components/Filter';
import { useTranslation } from 'react-i18next';
import { DataTable } from '../components/DataTable';
import { CreateContainer } from './CreateContainer';
import { headersTablePending, placeholderFilter } from '../utils/consts';

export function Home() {
	const { t } = useTranslation();
	const [organizedData, setOrganizedData] = useState(null);

	useEffect(() => {
		const url = 'http://localhost:3000/api/exports/pendingExports';
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const organizeDataByExportNumber = (data) => {
					const groupedData = {};

					data.forEach((record) => {
						const { export_number, status_approval_sample, shipment_date, ...rest } = record;
						const status =
							status_approval_sample === null || status_approval_sample.trim() === ''
								? 'Pending'
								: status_approval_sample;
						const updatedRecord = { ...rest, status_approval_sample: status, shipment_date };

						if (!groupedData[export_number]) {
							groupedData[export_number] = [];
						}

						groupedData[export_number].push(updatedRecord);
					});

					return groupedData;
				};
				const organizedData = organizeDataByExportNumber(data);
				setOrganizedData(organizedData);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}, []);

	return (
		<div className='bg-dark-background bg-cover bg-fixed'>
			<section className='homeContainer max-w-[90%] m-auto'>
				<Banner />
				{/* organized data section */}

				<h1 className='text-5xl font-bold my-8 uppercase text-yellow font-bayard'>{t('pendingTasks')}</h1>
				{organizedData && <DataTable headersTable={headersTablePending} dataTable={organizedData} />}
				{/* <div className='flex flex-row gap-5 justify-around mt-16'>
					{placeholderFilter.map((placeholder, index) => (
						<Filter key={index} placeholder={t(placeholder)} />
					))}
				</div> */}
			</section>
		</div>
	);
}
