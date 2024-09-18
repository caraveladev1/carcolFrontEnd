import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitButton } from './SubmitButton';
import { labelsBoogkindAndDates } from '../utils/consts';

export const BookingAndDates = memo(function BookingAndDates({
	exportNumber,
	selectOptions,
	required,
	initialFormData,
}) {
	const { t } = useTranslation();

	const [formData, setFormData] = useState({
		booking: '',
		dateLoadingPort: '',
		estimatedDelivery: '',
		estimatedArrival: '',
		exportId: '',
		announcement: '',
		order: '',
		review: '',
		salesCode: '',
		exportDate: '',
	});

	useEffect(() => {
		if (initialFormData) {
			setFormData(initialFormData);
		}
	}, [initialFormData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log({ ...formData, exportNumber });

		try {
			const response = await fetch('http://localhost:3000/api/exports/addBookingAndDates', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...formData, exportNumber }),
			});

			if (!response.ok) {
				throw new Error('Error en la solicitud');
			}

			window.alert('Container updated successfully');
			window.location.reload();
		} catch (error) {
			console.error('Error al enviar los datos:', error);
		}
	};

	return (
		<div className='flex items-center justify-center w-full bg-beige'>
			<form onSubmit={handleSubmit} className='grid grid-cols-4 gap-4 p-4'>
				{labelsBoogkindAndDates.map((label, index) => (
					<React.Fragment key={index}>
						<div className='bg-cafe/10  p-3'>
							<label
								htmlFor={label}
								className='block text-verdeTexto font-bold p-4 font-itf border-2 uppercase border-verdeTexto'
							>
								{t(label)}
							</label>
							{label === 'exportId' ? (
								<select
									id={label}
									name={label}
									value={formData[label]}
									onChange={handleChange}
									className='bg-transparent font-itf border-2 border-verdeTexto p-4 mt-4 w-full text-verdeTexto focus:outline-none focus:border-2 focus:border-verdeTexto  uppercase'
								>
									<option value=''>{t('selectOption')}</option>
									{selectOptions.map((option, idx) => (
										<option key={idx} value={option}>
											{option}
										</option>
									))}
								</select>
							) : (
								<input
									type={
										label === 'booking' ||
										label === 'announcement' ||
										label === 'order' ||
										label === 'review' ||
										label === 'salesCode'
											? 'text'
											: 'date'
									}
									id={label}
									name={label}
									value={formData[label]}
									//required={required}
									onChange={handleChange}
									className='bg-transparent font-itf border-2  border-verdeTexto p-4 mt-4 w-full text-verdeTexto focus:outline-none focus:border-2 focus:border-verdeTexto uppercase'
								/>
							)}
						</div>
					</React.Fragment>
				))}
				<SubmitButton className='col-span-4' color='verdeTexto' typeButton='submit' />
			</form>
		</div>
	);
});
