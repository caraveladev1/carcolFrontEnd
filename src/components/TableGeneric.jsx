import React from 'react';
import { useTranslation } from 'react-i18next';

export function TableGeneric({ headersTable, dataTable }) {
	const { t } = useTranslation();

	return (
		<div className='overflow-x-auto  mt-6 pb-6'>
			<table className='w-full table-fixed '>
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
					{dataTable.length > 0 ? (
						dataTable.map((row, rowIndex) => (
							<tr key={rowIndex} className='text-center border-y-[2px] border-y-transparent'>
								{headersTable.map((header, cellIndex) => (
									<td className='bg-verdeClaro/[.5] font-itf text-beige' key={cellIndex}>
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
