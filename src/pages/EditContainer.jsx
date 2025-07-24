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
import { useEditContainer } from '../Hooks';
import { FloatingScrollButton } from '../components/general/FloatingScrollButton';

export const EditContainer = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const { state, filteredTableData, handleCheckboxChange, control, resetFilters } = useEditContainer();

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

	// Removed pagination logic

	if (state.loading) return <Loader />;

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<FloatingScrollButton />
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-3xl font-bold uppercase text-pink font-itf mb-6'>{t('editContainer')}</h1>
				<h2 className='text-3xl font-bold uppercase text-pink font-itf mb-6'>{t('filters')}</h2>
				<FilterContainer columns={5}>
					<SelectInput
						name='destinationPort'
						control={control}
						options={[...new Set(state.tableData.map((row) => row.destinationPort))]}
						isMulti={true}
						placeholder='Select destination ports'
					/>
					<SelectInput
						name='incoterm'
						control={control}
						options={[...new Set(state.tableData.map((row) => row.incoterm))]}
						isMulti={true}
						placeholder='Select incoterms'
					/>
					<DateInput name='startDate' control={control} placeholder='Select start date' />
					<DateInput name='endDate' control={control} placeholder='Select end date' />
					<button
						type='button'
						onClick={resetFilters}
						className='bg-naranja hover:bg-red-600 text-white font-itf text-lg uppercase p-4 w-full h-full min-h-[60px] transition-colors duration-200'
					>
						{t('resetFilters')}
					</button>
				</FilterContainer>
				<h2 className='text-3xl font-bold uppercase text-pink font-itf mb-6'>{t('containerData')}</h2>
				<FiltersEditContainer filterValues={state.filtersData} selectedIcos={state.selectedIcos} oldExportId={id} />
				<TableGeneric headersTable={TABLE_HEADERS.EDIT_CONTAINER} dataTable={tableData} />
				{/* Removed Pagination component */}
			</section>
		</div>
	);
};
