import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import commentsButton from '../assets/img/commentsButton.webp';
import { BookingAndDates } from './BookingAndDates';

export function DataTable({ headersTable, dataTable }) {
	const { t } = useTranslation();
	const [openContainer, setOpenContainer] = useState(null);

	const handleAddBookingAndDatesClick = (exportNumber) => {
		setOpenContainer(openContainer === exportNumber ? null : exportNumber);
	};

	return (
		<div>
			{Object.keys(dataTable).map((exportNumber) => (
				<div key={exportNumber} className='mb-8'>
					<div className='flex flex-row justify-between'>
						<h2 className='text-4xl font-bold text-beige mb-4 font-bayard uppercase'>{exportNumber}</h2>
						<button
							className='text-verdeClaro text-4xl cursor-pointer font-bayard'
							onClick={() => handleAddBookingAndDatesClick(exportNumber)}
						>
							{t('addBookingAndDates')}
						</button>
					</div>
					<table className='w-full table-fixed'>
						<thead>
							<tr className='bg-beige font-bayard text-2xl'>
								{headersTable.map((header, index) => (
									<th className={`w-1/${headersTable.length} text-center text-verdeTexto`} key={index}>
										{t(header)}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{dataTable[exportNumber].map((row, rowIndex) => {
								const { approval_terms, ...filteredRow } = row;
								return (
									<tr key={rowIndex} className='text-center border-y-[2px] border-y-transparent'>
										{Object.keys(filteredRow).map((key, cellIndex) => (
											<td className='bg-verdeClaro/[.5] font-itf text-beige' key={cellIndex}>
												{filteredRow[key]}
											</td>
										))}
										<td className='bg-verdeClaro/[.5]'>
											<a href='mailto:' className='max-w-[20%] flex justify-center items-center m-auto cursor-pointer'>
												<img src={commentsButton} alt='Comments Button' />
											</a>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					<div style={{ display: openContainer === exportNumber ? 'block' : 'none' }}>
						<BookingAndDates exportNumber={exportNumber} />
					</div>
				</div>
			))}
		</div>
	);
}
