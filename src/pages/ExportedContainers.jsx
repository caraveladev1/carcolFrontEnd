import React from 'react';
import { ViewDetails } from '../components/ViewDetails';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { TABLE_HEADERS } from '../constants';
import { Loader } from '../components/Loader';
import { InputGeneric } from '../components/InputGeneric';
import { useExportedContainers } from '../hooks';

export function ExportedContainers() {
	const { t } = useTranslation();
	const {
		organizedData,
		loading,
		showDetails,
		selectedExpId,
		countryOptions,
		portOptions,
		filters,
		handleFilterChange,
		handleViewDetails,
		closeDetails,
		filteredData,
	} = useExportedContainers();

	if (loading) {
		return <Loader />;
	}

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
							<button
								className='text-3xl font-bold text-white mb-4 font-bayard uppercase'
								onClick={() => handleViewDetails(exp_id)}
							>
								{t('viewDetails')}
							</button>
						</div>

						<TableGeneric
							headersTable={TABLE_HEADERS.EXPORTED}
							dataTable={filteredData()[exp_id]}
							renderRowContent={(row) => row}
						/>
					</div>
				))}

				{/* Mostrar ViewDetails si showDetails es true */}
				{showDetails && <ViewDetails onClose={closeDetails} exp_id={selectedExpId} />}
			</section>
		</div>
	);
}
