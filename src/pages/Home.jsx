import React, { useEffect, useState } from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric'; // Reemplazamos DataTable por TableGeneric
import { headersTablePending } from '../utils/consts';
import { Loader } from '../components/Loader'; // Importa el componente Loader

export function Home() {
	const { t } = useTranslation();
	const [organizedData, setOrganizedData] = useState(null);
	const [loading, setLoading] = useState(true); // Estado para manejar la carga

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
				setLoading(false); // Cambia el estado a false una vez los datos están cargados
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoading(false); // Asegura que el loader desaparezca en caso de error
			});
	}, []);

	if (loading) {
		return <Loader />; // Muestra el loader mientras se cargan los datos
	}

	return (
		<div className='bg-dark-background bg-cover bg-fixed'>
			<section className='homeContainer max-w-[90%] m-auto'>
				<Banner />
				{/* organized data section */}
				<h1 className='text-5xl font-bold my-8 uppercase text-yellow font-bayard'>{t('pendingTasks')}</h1>
				{organizedData && (
					<TableGeneric
						headersTable={headersTablePending} // Los headers vienen de consts
						dataTable={organizedData} // Pasamos los datos organizados
						renderRowContent={(row) => row} // Pasamos la lógica de renderización
					/>
				)}
			</section>
		</div>
	);
}
