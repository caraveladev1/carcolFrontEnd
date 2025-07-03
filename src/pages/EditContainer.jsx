import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Banner } from '../components/Banner';
import { Loader } from '../components/Loader';
import { TableGeneric } from '../components/TableGeneric';
import { FiltersEditContainer } from '../components/FiltersEditContainer';
import { TABLE_HEADERS } from '../constants';
import { SelectInput } from '../components/SelectInput';
import { DateInput } from '../components/DateInput';
import { FilterContainer } from '../components/FilterContainer';
import { Pagination } from '../components/Pagination';
import { useEditContainer } from '../Hooks';
import { usePagination } from '../Hooks/usePagination';

export const EditContainer = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const {
		state,
		filteredTableData,
		handleCheckboxChange,
		control,
	} = useEditContainer();

	const tableData = filteredTableData().map((row) => ({
		...row,
		select: (
			<input
				type='checkbox'
				checked={state.selectedIcos.some((ico) => ico.ico === row.select)}
				onChange={() => handleCheckboxChange(row.select)}
			/>
		),
	}));

	const { currentPage, paginatedData, totalItems, goToPage } = usePagination(tableData, 100);

	if (state.loading) return <Loader />;

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('editContainer')}</h1>
				<h2 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('filters')}</h2>
				<FilterContainer columns={4}>
					<SelectInput name='destinationPort' control={control} options={[...new Set(state.tableData.map((row) => row.destinationPort))]} isMulti={true} placeholder='Select destination ports' />
					<SelectInput name='incoterm' control={control} options={[...new Set(state.tableData.map((row) => row.incoterm))]} isMulti={true} placeholder='Select incoterms' />
					<DateInput name='startDate' control={control} placeholder='Select start date' />
					<DateInput name='endDate' control={control} placeholder='Select end date' />
				</FilterContainer>
				<h2 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('containerData')}</h2>
				<FiltersEditContainer filterValues={state.filtersData} selectedIcos={state.selectedIcos} oldExportId={id} />
				<TableGeneric
					headersTable={TABLE_HEADERS.EDIT_CONTAINER}
					dataTable={paginatedData}
				/>
				<Pagination 
					currentPage={currentPage}
					totalItems={totalItems}
					itemsPerPage={100}
					onPageChange={goToPage}
				/>
			</section>
		</div>
	);
};
