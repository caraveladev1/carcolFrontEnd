import React, { useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Banner } from '../components/Banner';
import { DateInput } from '../components/DateInput';
import { SelectInput } from '../components/SelectInput';
import { TextInput } from '../components/TextInput';
import { FilterSidebar } from '../components/FilterSidebar';
import { SubmitButton } from '../components/SubmitButton';

import { TableGeneric } from '../components/TableGeneric';
import { Popup } from '../components/Popup';
import { TABLE_HEADERS } from '../constants';
import { useAnnouncements } from '../Hooks/useAnnouncements';

export function AnnouncementsPage() {
	const { t } = useTranslation();
	const { ico } = useParams();
	const navigate = useNavigate();

	const {
		data,
		filteredData,
		totals,
		filterControl,
		formControl,
		setValue,
		resetForm,
		submitAnnouncements,
		filterOptions,
		popup,
		closePopup,
		submitLoading,
		resetFilters,
	} = useAnnouncements(() => navigate('/view-containers'));

// Limpiar y reinicializar los valores del formulario solo cuando cambie la lista de ICOs filtrados (no al cambiar de página)
const prevIcosStrRef = useRef('');
useEffect(() => {
	const currentIcos = filteredData.map(item => item.ico).sort();
	const currentIcosStr = currentIcos.join(',');
	if (prevIcosStrRef.current !== currentIcosStr && resetForm) {
		const newValues = {};
		filteredData.forEach((item) => {
			newValues[item.ico] = {
				announcement: item.announcement || '',
				allocation: item.allocation || '',
				sales_code: item.sales_code || '',
				revision_number: item.revision_number || '',
			};
		});
		resetForm(newValues);
		prevIcosStrRef.current = currentIcosStr;
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, [filteredData]);



// Transform data for table display
const prepareDataForTable = (data) => {
	return data.map((item) => ({
		ico: item.ico,
		date_landing: item.date_landing,
		packaging_capacity: item.contract_atlas?.packaging_type || 'N/A',
		lot_type: item.contract_atlas?.lot_type || 'N/A',
		origin_port: item.origin_port,
		estimated_kg: item.contract_atlas?.estimated_kg || 0,
		units: item.contract_atlas?.units || 0,
		announcement: <TextInput name={`${item.ico}.announcement`} control={formControl} placeholder='Announcement' />,
		allocation: <TextInput name={`${item.ico}.allocation`} control={formControl} placeholder='Allocation' />,
		sales_code: <TextInput name={`${item.ico}.sales_code`} control={formControl} placeholder='Sales Code' />,
		revision_number: (
			<TextInput name={`${item.ico}.revision_number`} control={formControl} placeholder='Revision number' />
		),
	}));
};

const tableData = prepareDataForTable(filteredData);

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='max-w-[90%] m-auto'>
				<Banner />

				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-3xl font-bold uppercase text-pink font-itf'>{t('addAnnouncements')}</h1>
					<button
						className='bg-red-500 hover:bg-red-600 text-beige p-3 transition-colors duration-200 font-itf text-lg'
						onClick={() => navigate('/view-containers')}
					>
						Back
					</button>
				</div>

				<FilterSidebar title='announcementFilters'>
					<DateInput name='startDate' control={filterControl} />
					<DateInput name='endDate' control={filterControl} />
					<SelectInput
						name='packaging'
						control={filterControl}
						isMulti={true}
						options={filterOptions.packaging || []}
						placeholder='Select Packaging'
					/>
					<SelectInput
						name='originPort'
						control={filterControl}
						isMulti={true}
						options={filterOptions.originPort || []}
						placeholder='Select Origin Port'
					/>
					<SelectInput
						name='ico'
						control={filterControl}
						isMulti={true}
						options={filterOptions.ico || []}
						placeholder='Select ICOs'
					/>
					<SelectInput
						name='lotType'
						control={filterControl}
						isMulti={true}
						options={filterOptions.lotType || []}
						placeholder='Select Lot Type'
					/>
					<button
						type='button'
						onClick={() => resetFilters()}
						className='bg-naranja hover:bg-red-600 text-beige font-itf text-lg uppercase p-4 w-full h-full min-h-[60px] transition-colors duration-200'
					>
						{t('resetFilters')}
					</button>
				</FilterSidebar>

				{/* Totals Section */}
				<div className='my-6'>
					<div className='titleContainer flex flex-row justify-between gap-10 items-center'>
						<h2 className='text-3xl font-bold text-beige font-itf uppercase'>ANNOUNCEMENTS DATA</h2>
						<div className='containerData flex flex-row gap-4'>
							<p className='text-lg font-bold text-pink font-itf uppercase'>
								{`Total Estimated KG: ${totals.filteredEstimatedKg || 'No available'}`}
							</p>
							<p className='text-lg font-bold text-celeste font-itf uppercase'>
								{`Total Units: ${totals.filteredUnits || 'No available'}`}
							</p>
						</div>
					</div>
				</div>

				{/* Data Table */}
				<div className='my-4'>
			<TableGeneric
				headersTable={TABLE_HEADERS.ANNOUNCEMENTS}
				dataTable={tableData}
				renderRowContent={(row) => row}
			/>
				</div>

				{/* Pagination removed */}

				<div className='flex justify-end mt-6 pb-10'>
					<SubmitButton
						color='pink'
						typeButton='button'
						onClick={submitAnnouncements}
						buttonText='submit'
						loading={submitLoading}
						disabled={submitLoading}
					/>
				</div>

				<Popup
					isOpen={popup.isOpen}
					onClose={closePopup}
					title={t(popup.title)}
					message={t(popup.message)}
					type={popup.type}
				/>
			</section>
		</div>
	);
}
