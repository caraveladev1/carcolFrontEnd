import React from 'react';
import { useTranslation } from 'react-i18next';

export function TableGeneric({ headersTable, dataTable }) {
	const { t } = useTranslation();

	return (
		<div className='overflow-x-auto mt-6 pb-6'>
			<table className='min-w-full border-[2px] border-cafe' style={{ width: `${headersTable.length * 200}px` }}>
				<thead>
					<tr className='bg-beige font-bayard text-2xl border-[2px] border-cafe h-[3rem]'>
						{headersTable.map((header, index) => (
							<th className='w-[4rem] h-[3rem] text-center text-verdeTexto border-[2px] border-cafe' key={index}>
								{t(header)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{dataTable.length > 0 ? (
						dataTable.map((row, rowIndex) => (
							<tr key={rowIndex} className='text-center border-[2px] border-cafe h-[3rem]'>
								{headersTable.map((header, cellIndex) => (
									<td
										className='w-[4rem] h-[3rem] bg-verdeClaro/[.5] border-[2px] border-cafe font-itf text-beige px-4'
										key={cellIndex}
									>
										{row[header] || ''}
									</td>
								))}
							</tr>
						))
					) : (
						<tr>
							<td colSpan={headersTable.length} className='text-center py-4 bg-verdeClaro/[.5] font-itf text-beige'>
								No Data
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
