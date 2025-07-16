import React from 'react';
import { filtersEditContainer } from '../constants/filters.js';
import { LabelGeneric } from './LabelGeneric';
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';
import { DateInput } from './DateInput';
import { SubmitButton } from './SubmitButton';
import { Popup } from './Popup';
import { useTranslation } from 'react-i18next';
import { useFiltersEditContainer } from '../Hooks/useFiltersEditContainer';

export function FiltersEditContainer({ filterValues, selectedIcos, oldExportId }) {
	const { t } = useTranslation();
	const { control, optionsByFilter, onSubmit, setExported, popup, closePopup, submitLoading, exportLoading } =
		useFiltersEditContainer(filterValues, selectedIcos, oldExportId);

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
		<>
			<form onSubmit={onSubmit}>
				<div className='grid grid-cols-4 gap-4 items-stretch'>
					{orderedFilters.map((filter, index) => (
						<div key={index} className='col-span-2 flex items-stretch gap-4'>
							<LabelGeneric filter={filter} />
							{getInputComponent(filter)}
						</div>
					))}
					<SubmitButton
						className='col-span-1'
						color='celeste'
						typeButton='submit'
						buttonText='submit'
						loading={submitLoading}
						disabled={submitLoading}
					/>
					<SubmitButton
						className='col-span-1'
						color='pink'
						typeButton='button'
						buttonText='setExported'
						onClick={setExported}
						loading={exportLoading}
						disabled={exportLoading}
					/>
				</div>
			</form>
			<Popup
				isOpen={popup.isOpen}
				onClose={closePopup}
				title={t(popup.title)}
				message={t(popup.message)}
				type={popup.type}
			/>
		</>
	);
}
