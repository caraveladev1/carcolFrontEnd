import React from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { TABLE_HEADERS } from '../constants';
import { Loader } from '../components/Loader';
import { BookingAndDates } from '../components/BookingAndDates';
import { DateInput } from '../components/DateInput';
import { SelectInput } from '../components/SelectInput';
import { FilterContainer } from '../components/FilterContainer';
import { Pagination } from '../components/Pagination';
import { usePendingTasks } from '../Hooks';

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
		toggleBookingAndDates,
		filteredData,
		control,
		paginatedData,
		currentPage,
		totalItems,
		goToPage,
		itemsPerPage,
		resetFilters,
	} = usePendingTasks();

	if (loading) {
		return <Loader />;
	}
	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<h1 className='text-3xl font-bold my-8 uppercase text-celeste font-itf'>{t('pendingTasks')}</h1>

				<FilterContainer columns={5}>
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
				</FilterContainer>

				{paginatedData.map(([exp_id, taskData]) => (
					<div key={exp_id} className='my-4'>
						<div className='titleContainer flex flex-row justify-between items-center'>
							<h2 className='text-2xl font-bold text-white mb-4 font-itf uppercase'>{exp_id}</h2>
							<button
								className='bg-yellow-500 text-cafe font-itf uppercase text-xl font-bold px-2 py-1 bg-pink'
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
						<TableGeneric headersTable={TABLE_HEADERS.PENDING} dataTable={taskData} renderRowContent={(row) => row} />
					</div>
				))}

				<Pagination
					currentPage={currentPage}
					totalItems={totalItems}
					itemsPerPage={itemsPerPage}
					onPageChange={goToPage}
				/>
			</section>
		</div>
	);
}
