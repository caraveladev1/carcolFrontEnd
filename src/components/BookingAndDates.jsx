import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitButton } from './SubmitButton';
import { labelsBoogkindAndDates } from '../utils/consts';
import { useBookingForm } from '../Hooks';
import { bookingService } from '../services';
import { dateUtils } from '../utils';

export const BookingAndDates = memo(function BookingAndDates({
	exportNumber,
	selectOptions,
	required,
	initialFormData,
	relatedData,
}) {
	const { t } = useTranslation();
	const { formData, handleChange } = useBookingForm(initialFormData);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await bookingService.updateBookingAndDates(formData, exportNumber);
			window.alert('Container updated successfully');
			window.location.reload();
		} catch (error) {
			console.error('Error al enviar los datos:', error);
			window.alert('Error al enviar los datos');
		}
	};

	const setLoaded = async () => {
		try {
			bookingService.validateRelatedData(relatedData);
			console.log('Datos relacionados:', relatedData);
			await bookingService.setContainerLoaded(exportNumber);
			window.alert('Container updated successfully');
			window.location.reload();
		} catch (error) {
			console.error('Error al enviar los datos:', error);
			window.alert(error.message || 'Ocurrió un error al enviar los datos.');
		}
	};

	const today = dateUtils.getCurrentDate();
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
									value={formData[label] || ''}
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
									value={formData[label] || ''}
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
