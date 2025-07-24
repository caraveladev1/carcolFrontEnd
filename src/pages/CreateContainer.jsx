import React from 'react';
import { LabelGeneric } from '../components/LabelGeneric';
import { useTranslation } from 'react-i18next';
import { FILTER_NAMES, TABLE_HEADERS } from '../constants';
import { Banner } from '../components/Banner';
import { TextInput } from '../components/TextInput';
import { SelectInput } from '../components/SelectInput';
import { DateInput } from '../components/DateInput';
import { FilterContainer } from '../components/FilterContainer';
import { Loader } from '../components/Loader';
import { SubmitButton } from '../components/SubmitButton';
import { TableGeneric } from '../components/TableGeneric';
import { Popup } from '../components/Popup';
import { useCreateContainer } from '../Hooks';
import { FloatingScrollButton } from '../components/general/FloatingScrollButton';

export function CreateContainer() {
	const { t } = useTranslation();
	const {
		loading,
		submitLoading,
		selectOptions,
		preparedDataTable,
		handleSubmit,
		control,

		popup,
		closePopup,
		resetFilters,
	} = useCreateContainer();

	if (loading) {
		return <Loader />;
	}

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<FloatingScrollButton />
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-3xl font-bold uppercase text-pink font-itf mb-4'>{t('createContainer')}</h1>
				<form onSubmit={handleSubmit}>
					<FilterContainer columns={4}>
						{FILTER_NAMES.CREATE_CONTAINER.map((filter) => {
							const isSelect = ['port', 'capacityContainer', 'exportCountry', 'incoterm', 'originPort'].includes(
								filter,
							);
							const isDate = ['shipmentMonthStart', 'shipmentMonthFinal'].includes(filter);
							const isRequired = ['port', 'capacityContainer', 'exportCountry', 'incoterm', 'originPort'].includes(
								filter,
							);

							const getOptions = () => {
								switch (filter) {
									case 'port':
										return selectOptions.destinationPorts;
									case 'exportCountry':
										return selectOptions.exportCountry;
									case 'capacityContainer':
										return selectOptions.capacityContainer;
									case 'incoterm':
										return selectOptions.incoterm;
									case 'originPort':
										return selectOptions.originPort;
									default:
										return [];
								}
							};

							return (
								<div key={filter} className='col-span-2 flex items-stretch gap-4'>
									<LabelGeneric htmlFor={filter} filter={filter} />
									{isSelect ? (
										<SelectInput name={filter} control={control} options={getOptions()} required={isRequired} />
									) : isDate ? (
										<DateInput name={filter} control={control} />
									) : (
										<TextInput name={filter} control={control} />
									)}
								</div>
							);
						})}
						<SubmitButton
							className='bg-celeste col-span-2'
							color='celeste'
							typeButton='submit'
							buttonText='submit'
							loading={submitLoading}
							disabled={submitLoading}
						/>
						<button
							type='button'
							onClick={resetFilters}
							className='bg-naranja hover:bg-red-600 text-white font-itf text-lg uppercase p-4 col-span-2 transition-colors duration-200'
						>
							{t('resetFilters')}
						</button>
					</FilterContainer>
				</form>
				<TableGeneric headersTable={TABLE_HEADERS.CREATE_CONTAINER} dataTable={preparedDataTable} />
			</section>
			<Popup
				isOpen={popup.isOpen}
				onClose={closePopup}
				title={t(popup.title)}
				message={t(popup.message)}
				type={popup.type}
			/>
		</div>
	);
}
