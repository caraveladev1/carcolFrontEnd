import { useState, useEffect } from 'react';

export const useBookingForm = (initialFormData) => {
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
			const sanitizedData = {};
			Object.keys(formData).forEach((key) => {
				sanitizedData[key] = initialFormData[key] || '';
			});
			setFormData(sanitizedData);
		}
	}, [initialFormData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	return {
		formData,
		handleChange,
	};
};
