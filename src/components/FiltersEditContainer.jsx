import React from 'react';
import { filtersEditContainer } from '../utils/consts';
import { LabelGeneric } from './LabelGeneric';
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';
import { DateInput } from './DateInput';
import { SubmitButton } from './SubmitButton';
import { useTranslation } from 'react-i18next';
import { useFiltersEditContainer } from '../Hooks/useFiltersEditContainer';

export function FiltersEditContainer({ filterValues, selectedIcos, oldExportId }) {
	const { t } = useTranslation();
	const { control, optionsByFilter, onSubmit, setExported } = useFiltersEditContainer(
		filterValues,
		selectedIcos,
		oldExportId,
	);

	const getInputComponent = (filter) => {
		const isSelect = ['capacityContainer', 'port', 'incoterm', 'originPort'].includes(filter);
		const isDate = ['dateLandingPort', 'estimatedArrival', 'exportDate'].includes(filter);

		if (isSelect) {
			return (
				<SelectInput
					name={filter}
					control={control}
					options={optionsByFilter[filter] || []}
					placeholder={`Select ${filter}`}
				/>
			);
		} else if (isDate) {
			return <DateInput name={filter} control={control} />;
		} else {
			return <TextInput name={filter} control={control} placeholder={`Enter ${filter}`} />;
		}
	};

	const orderedFilters = [
		'booking',
		'dateLandingPort',
		'estimatedArrival',
		'exportDate',
		'capacityContainer',
		'port',
		'originPort',
		'incoterm',
		'exportId',
	];

	return (
		<form onSubmit={onSubmit}>
			<div className='grid grid-cols-4 gap-4 items-stretch'>
				{orderedFilters.map((filter, index) => (
					<div key={index} className='col-span-2 flex items-stretch gap-4'>
						<LabelGeneric filter={filter} />
						{getInputComponent(filter)}
					</div>
				))}
				<SubmitButton className='bg-celeste col-span-1' typeButton='submit' buttonText='submit' />
				<SubmitButton
					className='bg-pink col-span-1'
					typeButton='button'
					buttonText='setExported'
					onClick={setExported}
				/>
			</div>
		</form>
	);
}
