import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitButton } from './SubmitButton';

export const BookingAndDates = memo(function BookingAndDates({ exportNumber }) {
	const { t } = useTranslation();

	const [formData, setFormData] = useState({
		booking: '',
		dateLoadingPort: '',
		estimatedDelivery: '',
		estimatedArrival: '',
	});

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
			const response = await fetch('https://tu-api.com/endpoint', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: { ...formData, exportNumber },
			});

			if (!response.ok) {
				throw new Error('Error en la solicitud');
			}

			const result = await response.json();
			console.log('Resultado:', result);
		} catch (error) {
			console.error('Error al enviar los datos:', error);
		}
	};

	const labels = ['booking', 'dateLoadingPort', 'estimatedDelivery', 'estimatedArrival'];

	return (
		<div className='flex items-center justify-center w-full bg-beige'>
			<form onSubmit={handleSubmit} className='grid grid-cols-4 gap-4 p-4'>
				{labels.map((label, index) => (
					<React.Fragment key={index}>
						<div>
							<label
								htmlFor={label}
								className='block text-verdeTexto font-bold p-4 font-itf border-2 border-verdeTexto'
							>
								{t(label)}
							</label>
							<input
								type={label === 'booking' ? 'text' : 'date'}
								id={label}
								name={label}
								value={formData[label]}
								onChange={handleChange}
								className='bg-transparent font-itf border-2 border-verdeTexto p-4 mt-4 w-full text-verdeTexto focus:outline-none focus:border-2 focus:border-verdeTexto '
							/>
						</div>
					</React.Fragment>
				))}
				<SubmitButton color='verdeTexto' typeButton='submit' />
			</form>
		</div>
	);
});
