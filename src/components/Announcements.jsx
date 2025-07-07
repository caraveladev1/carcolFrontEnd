import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateInput } from './DateInput';
import { SelectInput } from './SelectInput';
import { TextInput } from './TextInput';
import { FilterContainer } from './FilterContainer';
import { Pagination } from './Pagination';
import { useAnnouncements } from '../Hooks/useAnnouncements';
import { usePagination } from '../Hooks/usePagination';

export function Announcements({ onClose }) {
	const { t } = useTranslation();
	const { data, filteredData, totals, filterControl, formControl, submitAnnouncements, filterOptions } =
		useAnnouncements(onClose);

	const { currentPage, paginatedData, totalItems, goToPage } = usePagination(filteredData, 50);

	return (
		<div className='announcementContainer fixed inset-0 bg-black/50 flex justify-center items-center'>
			<div className='popup w-[80%] overflow-auto max-h-[70%] bg-verde pt-12 px-4 relative'>
				<button className='absolute top-0 right-0 bg-red-500 text-white p-1' onClick={onClose}>
					<p className='font-bayard text-2xl px-4'>Close</p>
				</button>

				<FilterContainer columns={6}>
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
				</FilterContainer>

				<div className='container space-y-4'>
					{paginatedData.length > 0 ? (
						<>
							<div className='grid grid-cols-11 gap-4 font-bold text-pink text-center'>
								<p className='col-span-1 text-2xl font-bayard'>ICO</p>
								<p className='col-span-1 text-2xl font-bayard'>Date Landing</p>
								<p className='col-span-1 text-2xl font-bayard'>Packaging Capacity</p>
								<p className='col-span-1 text-2xl font-bayard'>Lot Type</p>
								<p className='col-span-1 text-2xl font-bayard'>Origin Port</p>
								<p className='col-span-1 text-2xl font-bayard'>Estimated KG</p>
								<p className='col-span-1 text-2xl font-bayard'>Units</p>
								<p className='col-span-1 text-2xl font-bayard'>Announcement</p>
								<p className='col-span-1 text-2xl font-bayard'>Allocation</p>
								<p className='col-span-1 text-2xl font-bayard'>Sales Code</p>
								<p className='col-span-1 text-2xl font-bayard'>Revision Number</p>
							</div>
							{paginatedData.map((item) => (
								<div key={item.ico} className='grid grid-cols-11 gap-4'>
									<p className='col-span-1 font-bayard text-2xl text-center m-auto text-pink'>{item.ico}</p>
									<p className='col-span-1 text-center font-bayard text-2xl m-auto text-pink'>{item.date_landing}</p>
									<p className='col-span-1 text-center font-bayard text-2xl m-auto text-pink'>
										{item.contract_atlas.packaging_type}
									</p>
									<p className='col-span-1 text-center font-bayard text-2xl m-auto text-pink'>
										{item.contract_atlas.lot_type}
									</p>
									<p className='col-span-1 text-center font-bayard text-2xl m-auto text-pink'>{item.origin_port}</p>
									<p className='col-span-1 text-center font-bayard text-2xl m-auto text-pink'>
										{item.contract_atlas.estimated_kg}
									</p>
									<p className='col-span-1 text-center font-bayard text-2xl m-auto text-pink'>
										{item.contract_atlas.units}
									</p>
									<div className='col-span-1'>
										<TextInput name={`${item.ico}.announcement`} control={formControl} placeholder='Announcement' />
									</div>
									<div className='col-span-1'>
										<TextInput name={`${item.ico}.allocation`} control={formControl} placeholder='Allocation' />
									</div>
									<div className='col-span-1'>
										<TextInput name={`${item.ico}.sales_code`} control={formControl} placeholder='Sales Code' />
									</div>
									<div className='col-span-1'>
										<TextInput
											name={`${item.ico}.revision_number`}
											control={formControl}
											placeholder='Revision number'
										/>
									</div>
								</div>
							))}

							<div className='grid grid-cols-11 gap-4 font-bold text-pink text-center mt-4'>
								<p className='col-span-5 m-auto text-2xl font-bayard'>Totals</p>
								<p className='col-span-1 text-2xl m-auto uppercase font-bayard'>{totals.filteredEstimatedKg}</p>
								<p className='col-span-1 text-2xl m-auto uppercase font-bayard'>{totals.filteredUnits}</p>
								<p className='col-span-4'></p>
							</div>
							<Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={50} onPageChange={goToPage} />
						</>
					) : (
						<p>No items to display.</p>
					)}
				</div>

				<div className='flex justify-end'>
					<button className='bg-pink text-white p-1 my-4' onClick={submitAnnouncements}>
						<p className='font-bayard text-2xl px-4'>Submit</p>
					</button>
				</div>
			</div>
		</div>
	);
}
