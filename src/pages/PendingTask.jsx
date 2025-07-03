import React from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { TABLE_HEADERS } from '../constants';
import { Loader } from '../components/Loader';
import { BookingAndDates } from '../components/BookingAndDates';
import { InputGeneric } from '../components/InputGeneric';
import { usePendingTasks } from '../hooks';

export function PendingTask() {
	const { t } = useTranslation();
	const {
		organizedData,
		expId,
		loading,
		showBookingAndDates,
		initialFormData,
		countryOptions,
		portOptions,
		filters,
		toggleBookingAndDates,
		handleFilterChange,
		filteredData,
	} = usePendingTasks();

	if (loading) {
		return <Loader />;
	}
	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<h1 className='text-5xl font-bold my-8 uppercase text-celeste font-bayard'>{t('pendingTasks')}</h1>

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
						defaultValue={filters.destinationContainer}
						options={portOptions}
						multiple={true}
					/>
				</div>

				{Object.keys(filteredData()).map((exp_id) => (
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
								initialFormData={initialFormData[exp_id]}
								relatedData={organizedData[exp_id]}
							/>
						)}
						<TableGeneric
							headersTable={TABLE_HEADERS.PENDING}
							dataTable={filteredData()[exp_id]}
							renderRowContent={(row) => row}
						/>
					</div>
				))}
			</section>
		</div>
	);
}
