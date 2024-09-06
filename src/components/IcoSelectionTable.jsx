import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function IcoSelectionTable({ headersTable, dataTable, onAddIco = (icoId) => {} }) {
	const { t } = useTranslation();
	const [selectedIco, setSelectedIco] = useState(null);

	const handleIcoClick = (icoId) => {
		setSelectedIco(icoId);
	};

	// Definimos el orden de las columnas
	const columnOrder = [
		'ico_id',
		'mark',
		'packaging_capacity',
		'units' /* Agrega aquí las demás columnas en el orden deseado */,
	];

	return (
		<div>
			<h2 className='text-4xl font-bold text-beige mb-4 font-bayard uppercase'>ICO Selection</h2>
			<table className='w-full table-fixed'>
				<thead>
					<tr className='bg-beige font-bayard text-2xl'>
						{headersTable.map((header, index) => (
							<th className={`w-1/${headersTable.length} text-center text-verdeTexto`} key={index}>
								{t(header)}
							</th>
						))}
						<th className='text-center text-verdeTexto'>{t('Select_ICO')}</th>
					</tr>
				</thead>
				<tbody>
					{Array.isArray(dataTable) && dataTable.length > 0 ? (
						dataTable.map((row, rowIndex) => {
							return (
								<tr
									key={rowIndex}
									className={`text-center border-y-[2px] border-y-transparent my-4 ${selectedIco === row.ico_id ? 'bg-verdeOscuro' : 'bg-verdeClaro/[.5]'}`}
									onClick={() => handleIcoClick(row.ico_id)}
								>
									{columnOrder.map((column, cellIndex) => (
										<td className='font-itf text-beige' key={cellIndex}>
											{row[column]}
										</td>
									))}
									<td className='font-itf text-beige cursor-pointer'>{row.ico_id}</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={headersTable.length + 1} className='text-center py-4'>
								No data available
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
