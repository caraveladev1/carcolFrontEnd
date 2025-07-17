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
import { FilterSidebar } from '../components/FilterSidebar';
import { Pagination } from '../components/Pagination';
import { WeightsTooltip } from '../components/WeightsTooltip';
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
		resetFilters,
		weightsTooltipVisible,
		calculateWeightsData,
		showWeightsTooltip,
		hideWeightsTooltip,
		toggleWeightsTooltip,
	} = useExportedContainers();

	if (loading) {
		return <Loader />;
	}

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<h1 className='text-3xl font-bold my-8 uppercase text-beige font-itf'>{t('exportedContainers')}</h1>

				{/* Filtros */}
				<FilterSidebar title='filters'>
					<DateInput name='initialDate' control={control} />
					<DateInput name='finalDate' control={control} />
					<SelectInput name='exportCountry' control={control} options={countryOptions} isMulti={true} />
					<SelectInput name='destinationPort' control={control} options={portOptions} isMulti={true} />
					<button
						type='button'
						onClick={resetFilters}
						className='bg-naranja hover:bg-red-600 text-white font-itf text-lg uppercase p-4 w-full h-full min-h-[60px] transition-colors duration-200'
					>
						{t('resetFilters')}
					</button>
				</FilterSidebar>

				{paginatedData.map(([exp_id, containerData]) => {
					const totalWeight = containerData.reduce((sum, item) => {
						const weight = parseFloat(item.weight) || 0;
						return sum + weight;
					}, 0);

					const weightsData = calculateWeightsData(containerData);

					return (
						<div key={exp_id} className='my-4'>
							<div className='titleContainer flex flex-row justify-between items-center'>
								<div className='flex flex-row justify-between items-center gap-6'>
									<h2 className='text-2xl font-bold text-white mb-4 font-itf uppercase'>{exp_id}</h2>
								</div>
								<div className='containerData flex flex-row gap-4'>
									<button
										className='text-lg font-bold text-cafe font-itf uppercase hover:text-celeste-400 transition-colors duration-200 bg-beige px-2 py-1'
										onClick={() => handleViewDetails(exp_id)}
									>
										{t('viewDetails')}
									</button>
									<div
										className='relative'
										onClick={() => toggleWeightsTooltip(exp_id)}
									>
										<button className='text-lg font-bold text-cafe font-itf uppercase cursor-pointer hover:text-pink-400 transition-colors duration-200 bg-beige px-2 py-1'>
											{t('weightDetails')}
										</button>
										<WeightsTooltip
											isVisible={weightsTooltipVisible[exp_id] || false}
											weightsData={weightsData}
											position='top'
											onClose={() => hideWeightsTooltip(exp_id)}
										/>
									</div>
								</div>
							</div>
							<TableGeneric
								headersTable={TABLE_HEADERS.EXPORTED}
								dataTable={containerData}
								renderRowContent={(row) => row}
							/>
						</div>
					);
				})}

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
