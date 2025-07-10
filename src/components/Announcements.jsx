import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateInput } from './DateInput';
import { SelectInput } from './SelectInput';
import { TextInput } from './TextInput';
import { FilterContainer } from './FilterContainer';
import { SubmitButton } from './SubmitButton';
import { Pagination } from './Pagination';
import { TableGeneric } from './TableGeneric';
import { Popup } from './Popup';
import { TABLE_HEADERS } from '../constants';
import { useAnnouncements } from '../Hooks/useAnnouncements';

export function Announcements({ onClose }) {
	const { t } = useTranslation();
	const {
		data,
		filteredData,
		totals,
		filterControl,
		formControl,
		submitAnnouncements,
		filterOptions,
		popup,
		closePopup,
		submitLoading,
		resetFilters,
	} = useAnnouncements(onClose);

	const itemsPerPage = 50;
	const [currentPage, setCurrentPage] = React.useState(1);

	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return filteredData.slice(startIndex, endIndex);
	}, [filteredData, currentPage]);

	const totalItems = filteredData.length;

	const goToPage = (page) => {
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

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

	const tableData = prepareDataForTable(paginatedData);

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen fixed inset-0 bg-black/50 flex justify-center items-center'>
			<div className='max-w-[90%] w-full max-h-[90%] overflow-auto bg-dark-background p-6 relative'>
				<button
					className='absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-beige p-1 transition-colors duration-200'
					onClick={onClose}
				>
					<span className='font-itf text-lg py-2 px-2'>Close</span>
				</button>

				<h1 className='text-3xl font-bold uppercase text-pink font-itf mb-6'>{t('addAnnouncements')}</h1>

				<FilterContainer columns={7}>
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
				</FilterContainer>

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

				<Pagination
					currentPage={currentPage}
					totalItems={totalItems}
					itemsPerPage={itemsPerPage}
					onPageChange={goToPage}
				/>

				<div className='flex justify-end mt-6'>
					<SubmitButton
						color='pink'
						typeButton='button'
						onClick={submitAnnouncements}
						buttonText='submit'
						loading={submitLoading}
						disabled={submitLoading}
					/>
				</div>
			</div>

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
