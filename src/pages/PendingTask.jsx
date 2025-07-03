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
		toggleBookingAndDates,
		filteredData,
		control,
	} = usePendingTasks();

	if (loading) {
		return <Loader />;
	}
	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<h1 className='text-5xl font-bold my-8 uppercase text-celeste font-bayard'>{t('pendingTasks')}</h1>

				<FilterContainer columns={4}>
					<DateInput name='initialDate' control={control} />
					<DateInput name='finalDate' control={control} />
					<SelectInput name='exportCountry' control={control} options={countryOptions} isMulti={true} />
					<SelectInput name='destinationPort' control={control} options={portOptions} isMulti={true} />
				</FilterContainer>

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
