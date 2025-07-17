import React from 'react';
import { useTranslation } from 'react-i18next';

export function TableGeneric({ headersTable, dataTable }) {
	const { t } = useTranslation();

	return (
		<div className='overflow-x-auto mt-6 pb-6'>
			<table className='min-w-full border-[2px] border-cafe table-auto' >
				<thead>
					<tr className='bg-beige uppercase font-itf text-lg border-[2px] border-cafe h-[3rem]'>
						{headersTable.map((header, index) => (
							<th className='h-[3rem] text-center text-verdeTexto border-[2px] border-cafe px-4 whitespace-nowrap' key={index}>
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
										className='h-[3rem] bg-verdeClaro/[.5] border-[2px] border-cafe font-itf text-beige px-4 whitespace-nowrap'
										key={cellIndex}
									>
										{row[header] || ''}
									</td>
								))}
							</tr>
						))
					) : (
						<tr>
							<td colSpan={headersTable.length} className='text-center py-4 bg-verdeClaro/[.5] font-itf text-beige px-4'>
								No Data
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
