import React, { useState } from 'react';
import { InputGeneric } from './InputGeneric';
import { API_BASE_URL } from '../utils/consts';

export function Announcements({ onClose, ico }) {
	// Inicializa el estado con los datos de `ico`
	const [formData, setFormData] = useState(
		ico.reduce((acc, item) => {
			acc[item.ico_id] = {
				announcement: item.announcement || '',
				orders: item.orders || '',
				review: item.review || '',
				sales_code: item.sales_code || '',
			};
			return acc;
		}, {}),
	);

	// Maneja el cambio en los inputs
	const handleInputChange = (icoId, field, value) => {
		setFormData((prevData) => ({
			...prevData,
			[icoId]: {
				...prevData[icoId],
				[field]: value,
			},
		}));
		//console.log(formData);
	};

	function addAnnoucements() {
		fetch(`${API_BASE_URL}api/exports/addAnnouncements`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then((response) => response.json())
			.then((data) => {
				window.alert('Announcements added successfully');
				window.location.reload();
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
	return (
		<div className='announcementContainer fixed inset-0 bg-black/50 flex justify-center items-center '>
			<div className='popup w-[80%] overflow-auto max-h-[70%]  bg-beige pt-12 px-4 relative'>
				<button className='absolute top-0 right-0 bg-red-500 text-white p-1' onClick={onClose}>
					<p className='font-bayard text-2xl px-4'>Close</p>
				</button>
				<div className='container space-y-4 '>
					{ico && ico.length > 0 ? (
						ico.map((item, index) => (
							<div key={index} className='grid grid-cols-5 gap-4'>
								<p className='col-span-1 font-bayard text-2xl text-center m-auto text-pink'>{item.ico_id}</p>
								<div className='col-span-1'>
									<InputGeneric
										placeholder='Announcement'
										defaultValue={formData[item.ico_id].announcement}
										onChange={(e) => handleInputChange(item.ico_id, 'announcement', e.target.value)}
									/>
								</div>
								<div className='col-span-1'>
									<InputGeneric
										placeholder='Order'
										defaultValue={formData[item.ico_id].orders}
										onChange={(e) => handleInputChange(item.ico_id, 'orders', e.target.value)}
									/>
								</div>
								<div className='col-span-1'>
									<InputGeneric
										placeholder='Review'
										defaultValue={formData[item.ico_id].review}
										onChange={(e) => handleInputChange(item.ico_id, 'review', e.target.value)}
									/>
								</div>
								<div className='col-span-1'>
									<InputGeneric
										placeholder='Sales Code'
										defaultValue={formData[item.ico_id].sales_code}
										onChange={(e) => handleInputChange(item.ico_id, 'sales_code', e.target.value)}
									/>
								</div>
							</div>
						))
					) : (
						<p>No items to display.</p>
					)}
				</div>
				<div className='flex justify-end'>
					<button className='bg-verde text-white p-1 my-4' onClick={addAnnoucements}>
						<p className='font-bayard text-2xl px-4'>Submit</p>
					</button>
				</div>
			</div>
		</div>
	);
}
