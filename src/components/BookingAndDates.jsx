import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitButton } from './SubmitButton';
import { labelsBoogkindAndDates, API_BASE_URL } from '../utils/consts';

export const BookingAndDates = memo(function BookingAndDates({
	exportNumber,
	selectOptions,
	required,
	initialFormData,
	relatedData,
}) {
	const { t } = useTranslation();

	const [formData, setFormData] = useState({
		booking: '',
		dateLandingPort: '',
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
		//console.log(name, value);
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		//console.log({ ...formData, exportNumber });

		try {
			const response = await fetch(`${API_BASE_URL}api/exports/addBookingAndDates`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...formData, exportNumber }),
			});

			if (!response.ok) {
				window.alert('Error al enviar los datos');
			}

			window.alert('Container updated successfully');
			window.location.reload();
		} catch (error) {
			console.error('Error al enviar los datos:', error);
		}
	};
	async function setLoaded() {
		if (!relatedData || relatedData.length === 0) {
			window.alert('No hay datos relacionados para validar.');
			return;
		}

		//console.log('Datos relacionados:', relatedData);

		const invalidEntries = relatedData.filter((item) => {
			if (
				item.contract_atlas.customerCuppingState === 'Not Sent' ||
				item.contract_atlas.customerCuppingState === 'Sent' ||
				item.contract_atlas.customerCuppingState === 'Rejected'
			) {
				return true;
			}

			if (item.contract_atlas.price_type !== 'fixed' && item.contract_atlas.fixed_price_status !== 'Fixed') {
				return true;
			}

			return false;
		});

		if (invalidEntries.length > 0) {
			window.alert(
				'The sample and/or fixation are not valid for loading the container. Please check the data before proceeding.',
			);
			console.warn('Datos no válidos:', invalidEntries);
			return;
		}

		try {
			const response = await fetch(`${API_BASE_URL}api/exports/setLoaded`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ setLoaded: '1', exportNumber }),
			});

			if (!response.ok) {
				window.alert('Error al enviar los datos');
			} else {
				window.alert('Container updated successfully');
				window.location.reload();
			}
		} catch (error) {
			console.error('Error al enviar los datos:', error);
			window.alert('Ocurrió un error al enviar los datos.');
		}
	}

	const getCurrentDate = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};
	const today = getCurrentDate();
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
									min={
										label === 'exportDate' ||
										label === 'dateLandingPort' ||
										label === 'estimatedDelivery' ||
										label === 'estimatedArrival' ||
										label.includes('date')
											? today
											: undefined
									}
									//required={required}
									onChange={handleChange}
									className='bg-transparent font-itf border-2  border-verdeTexto p-4 mt-4 w-full text-verdeTexto focus:outline-none focus:border-2 focus:border-verdeTexto uppercase'
								/>
							)}
						</div>
					</React.Fragment>
				))}
				<div className='flex flex-row gap-4 justify-between	w-full col-span-4'>
					<SubmitButton className='w-full' color='verdeTexto' typeButton='submit' buttonText='submit' />
					<SubmitButton
						className='w-full'
						color='naranja'
						typeButton='button'
						onClick={setLoaded}
						buttonText='setLoaded'
					/>
				</div>
			</form>
		</div>
	);
});
