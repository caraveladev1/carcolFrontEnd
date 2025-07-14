import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/consts';

export function ViewDetails({ onClose, exp_id }) {
	const [data, setData] = useState(null); // Estado para los datos filtrados
	const [showData, setShowData] = useState({}); // Datos para mostrar

	useEffect(() => {
		// Llamada a la API
		const url = `${API_BASE_URL}api/exports/getExportedContainers`;
		fetch(url)
			.then((response) => response.json())
			.then((responseData) => {
				console.log('API Response:', responseData);

				// Accede al array correspondiente al `exp_id`
				if (responseData && responseData[exp_id]) {
					const filteredData = responseData[exp_id][0]; // Primer elemento del array
					console.log('Filtered Data for:', filteredData);
					setData(filteredData || null);
				} else {
					console.error('No data found for:', exp_id);
					setData(null); // Manejo cuando no hay datos
				}
			})
			.catch((error) => {
				console.error('Error:', error);
				setData(null); // En caso de error, establece null
			});
	}, [exp_id]);

	useEffect(() => {
		// Configura `showData` solo cuando `data` esté disponible
		if (data) {
			setShowData({
				booking: data.booking || 'N/A',
				date_landing: data.date_landing || 'N/A',
				export_date: data.export_date || 'N/A',
				estimated_arrival: data.estimated_arrival || 'N/A',
				announcement: data.announcement || 'N/A',
				revision_number: data.revision_number || 'N/A',
				sales_code: data.sales_code || 'N/A',
			});
		}
	}, [data]);

	return (
		<div className='announcementContainer fixed inset-0 bg-black/50 flex justify-center items-center'>
			<div className='relative'>
				<button
					className='absolute -top-4 -right-4 bg-red-500 font-itf text-white text-lg w-8 h-8 flex items-center justify-center z-10'
					onClick={onClose}
				>
					X
				</button>
				<div className='popup w-[80vw] min-w-[300px] max-w-[90vw] overflow-auto max-h-[70vh] bg-beige p-4'>
					<div>
						<h2 className='text-lg font-bold mb-4 font-itf'>Details to: {exp_id}</h2>
					</div>
					<div className='details-container'>
						{data ? (
							Object.entries(showData).map(([key, value]) => (
								<div key={key} className='detail-item my-2 font-itf'>
									<strong className='capitalize'>{key.replace('_', ' ')}:</strong> {value}
								</div>
							))
						) : (
							<p>No se encontraron datos para este exp_id.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
