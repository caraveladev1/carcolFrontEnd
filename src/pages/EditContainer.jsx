import React from 'react';
import { useTranslation } from 'react-i18next';
import { Banner } from '../components/Banner';
import { Loader } from '../components/Loader';
import { TableGeneric } from '../components/TableGeneric';
import { FiltersEditContainer } from '../components/FiltersEditContainer';
import { TABLE_HEADERS } from '../constants';
import { InputGeneric } from '../components/InputGeneric';
import { useEditContainer } from '../hooks';

export const EditContainer = () => {
	const { t } = useTranslation();
	const {
		state,
		handleDestinationPortChange,
		handleIncotermChange,
		handleStartDateChange,
		handleEndDateChange,
		filteredTableData,
		handleCheckboxChange,
	} = useEditContainer();

	if (state.loading) return <Loader />;

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('editContainer')}</h1>
				<h2 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('filters')}</h2>
				<div className='filtersContainers flex flex-row justify-between gap-6'>
					<InputGeneric
						type='select'
						filter='destinationPort'
						options={[...new Set(state.tableData.map((row) => row.destinationPort))]}
						onChange={handleDestinationPortChange}
						multiple={true}
						placeholder='Select destination ports'
						className='mb-6'
					/>
					<InputGeneric
						type='select'
						filter='incoterm'
						options={[...new Set(state.tableData.map((row) => row.incoterm))]}
						onChange={handleIncotermChange}
						multiple={true}
						placeholder='Select incoterms'
						className='mb-6'
					/>
					<InputGeneric
						type='date'
						filter='startDate'
						onChange={handleStartDateChange}
						placeholder='Select start date'
						className='mb-6'
					/>
					<InputGeneric
						type='date'
						filter='endDate'
						onChange={handleEndDateChange}
						placeholder='Select end date'
						className='mb-6'
					/>
				</div>
				<h2 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('containerData')}</h2>
				<FiltersEditContainer filterValues={state.filtersData} selectedIcos={state.selectedIcos} oldExportId={id} />
				<TableGeneric
					headersTable={TABLE_HEADERS.EDIT_CONTAINER}
					dataTable={filteredTableData().map((row) => ({
						...row,
						select: (
							<input
								type='checkbox'
								checked={state.selectedIcos.some((ico) => ico.ico === row.select)}
								onChange={() => handleCheckboxChange(row.select)}
							/>
						),
					}))}
				/>
			</section>
		</div>
	);
};
