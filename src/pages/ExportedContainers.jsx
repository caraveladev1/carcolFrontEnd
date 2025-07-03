import React from 'react';
import { ViewDetails } from '../components/ViewDetails';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { TABLE_HEADERS } from '../constants';
import { Loader } from '../components/Loader';
import { DateInput } from '../components/DateInput';
import { SelectInput } from '../components/SelectInput';
import { FilterContainer } from '../components/FilterContainer';
import { Pagination } from '../components/Pagination';
import { useExportedContainers } from '../Hooks';

export function ExportedContainers() {
	const { t } = useTranslation();
	const {
		organizedData,
		loading,
		showDetails,
		selectedExpId,
		countryOptions,
		portOptions,
		handleViewDetails,
		closeDetails,
		filteredData,
		control,
		paginatedData,
		currentPage,
		totalItems,
		goToPage,
		itemsPerPage,
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
				<FilterContainer columns={4}>
					<DateInput name='initialDate' control={control} />
					<DateInput name='finalDate' control={control} />
					<SelectInput name='exportCountry' control={control} options={countryOptions} isMulti={true} />
					<SelectInput name='destinationPort' control={control} options={portOptions} isMulti={true} />
				</FilterContainer>

				{paginatedData.map(([exp_id, containerData]) => (
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
							dataTable={containerData}
							renderRowContent={(row) => row}
						/>
					</div>
				))}

				<Pagination 
					currentPage={currentPage}
					totalItems={totalItems}
					itemsPerPage={itemsPerPage}
					onPageChange={goToPage}
				/>

				{/* Mostrar ViewDetails si showDetails es true */}
				{showDetails && <ViewDetails onClose={closeDetails} exp_id={selectedExpId} />}
			</section>
		</div>
	);
}
