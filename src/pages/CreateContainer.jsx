import React from 'react';
import { LabelGeneric } from '../components/LabelGeneric';
import { useTranslation } from 'react-i18next';
import { FILTER_NAMES, TABLE_HEADERS } from '../constants';
import { Banner } from '../components/Banner';
import { InputGeneric } from '../components/InputGeneric';
import { Loader } from '../components/Loader';
import { SubmitButton } from '../components/SubmitButton';
import { TableGeneric } from '../components/TableGeneric';
import { useCreateContainer } from '../hooks';

export function CreateContainer() {
	const { t } = useTranslation();
	const {
		loading,
		selectOptions,
		filters,
		preparedDataTable,
		handleFilterChange,
		handleSubmit,
	} = useCreateContainer();

	if (loading) {
		return <Loader />;
	}

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-5xl font-bold uppercase text-pink font-bayard'>{t('createContainer')}</h1>
				<form onSubmit={handleSubmit}>
					<div className='grid grid-cols-4 gap-4'>
						{FILTER_NAMES.CREATE_CONTAINER.map((filter) => (
							<div key={filter} className='col-span-2 flex items-center gap-4 '>
								<LabelGeneric htmlFor={filter} filter={filter} />
								<InputGeneric
									type={
										filter === 'port' ||
										filter === 'capacityContainer' ||
										filter === 'exportCountry' ||
										filter === 'incoterm' ||
										filter === 'originPort'
											? 'select'
											: filter === 'shipmentMonthStart' || filter === 'shipmentMonthFinal'
												? 'date'
												: 'text'
									}
									filter={filter}
									name={filter}
									defaultValue={filters[filter]}
									options={
										filter === 'port'
											? selectOptions.destinationPorts
											: filter === 'exportCountry'
												? selectOptions.exportCountry
												: filter === 'capacityContainer'
													? selectOptions.capacityContainer
													: filter === 'incoterm'
														? selectOptions.incoterm
														: filter === 'originPort'
															? selectOptions.originPort
															: []
									}
									onChange={handleFilterChange}
									required={
										filter === 'port' ||
										filter === 'capacityContainer' ||
										filter === 'exportCountry' ||
										filter === 'incoterm' ||
										filter === 'originPort'
									}
								/>
							</div>
						))}
						<SubmitButton className='bg-celeste col-span-2' typeButton='submit' buttonText='submit' />
					</div>
				</form>
				<TableGeneric headersTable={TABLE_HEADERS.CREATE_CONTAINER} dataTable={preparedDataTable} />
			</section>
		</div>
	);
}
