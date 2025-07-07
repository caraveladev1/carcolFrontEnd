import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { containerCapacity, API_BASE_URL } from '../utils/consts';

export const useFiltersEditContainer = (filterValues, selectedIcos, oldExportId) => {
	const navigate = useNavigate();
	const { containers: defaultValues, contract_atlas: optionValues } = filterValues;
	const [popup, setPopup] = useState({
		isOpen: false,
		title: '',
		message: '',
		type: 'info',
	});
	const [submitLoading, setSubmitLoading] = useState(false);
	const [exportLoading, setExportLoading] = useState(false);

	const containerLabels = Object.keys(containerCapacity);

	const defaultValuesFormatted = {
		booking: defaultValues[0]?.booking || '',
		dateLandingPort: defaultValues[0]?.date_landing || '',
		capacityContainer: defaultValues[0]?.container_capacity || '',
		estimatedArrival: defaultValues[0]?.estimated_arrival || '',
		port: defaultValues[0]?.destination_port || '',
		originPort: defaultValues[0]?.origin_port || '',
		exportDate: defaultValues[0]?.export_date || '',
		incoterm: defaultValues[0]?.incoterm || '',
		exportId: defaultValues[0]?.exp_id || '',
	};

	const optionsByFilter = {
		capacityContainer: containerLabels,
		port: [...new Set(optionValues.map((option) => option.destination_port || 'N/A'))],
		originPort: [...new Set(optionValues.map((option) => option.origin_port || 'N/A'))],
		incoterm: [...new Set(optionValues.map((option) => option.incoterm || 'N/A'))],
		exportId: [...new Set(defaultValues?.map((item) => item?.contract_atlas?.export).filter(Boolean))],
	};

	const { control, handleSubmit } = useForm({
		defaultValues: defaultValuesFormatted,
	});

	const updateContainer = async (data) => {
		setSubmitLoading(true);
		try {
			const payload = {
				old_id: oldExportId,
				states: defaultValues[0],
				selectedIcos: selectedIcos,
				filters: data,
			};

			if (defaultValues[0]?.is_pending === '1') {
				const limitedPayload = {
					old_id: parseInt(oldExportId),
					filters: {
						exportDate: data.exportDate,
						estimatedArrival: data.estimatedArrival,
					},
				};

				const response = await fetch(`${API_BASE_URL}api/exports/updateContainerAfterLoaded`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(limitedPayload),
				});

				if (!response.ok || !limitedPayload.filters.exportDate || !limitedPayload.filters.estimatedArrival) {
					setPopup({
						isOpen: true,
						title: 'validationError',
						message: 'containerLoadedUpdateNotice',
						type: 'warning',
					});
					throw new Error('Missing required date fields');
				}

				setPopup({
					isOpen: true,
					title: 'success',
					message: 'containerLoadedUpdateSuccess',
					type: 'success',
				});
				setTimeout(() => {
					navigate('/view-containers');
				}, 3000);
				return;
			}

			const sumIcosWeight = payload.selectedIcos.reduce(
				(acc, element) => acc + (parseInt(element.estimated_kg, 10) || 0),
				0,
			);

			const selectedContainerValue = containerCapacity[payload.filters.capacityContainer];

			if (!selectedContainerValue) {
				setPopup({
					isOpen: true,
					title: 'validationError',
					message: 'invalidContainerCapacity',
					type: 'error',
				});
				return;
			}

			if (sumIcosWeight > selectedContainerValue) {
				setPopup({
					isOpen: true,
					title: 'validationError',
					message: 'weightExceedsCapacity',
					type: 'error',
				});
				return;
			}

			const response = await fetch(`${API_BASE_URL}api/exports/updateContainer`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!response.ok) throw new Error('Network response was not ok');

			setPopup({
				isOpen: true,
				title: 'success',
				message: 'containerUpdatedSuccessfully',
				type: 'success',
			});
			setTimeout(() => {
				navigate('/view-containers');
			}, 2000);
		} catch (error) {
			console.error('Error:', error);
			setPopup({
				isOpen: true,
				title: 'error',
				message: 'errorCreatingContainer',
				type: 'error',
			});
		} finally {
			setSubmitLoading(false);
		}
	};

	const setExported = async () => {
		setExportLoading(true);
		try {
			if (defaultValues[0].is_pending !== '1') {
				setPopup({
					isOpen: true,
					title: 'validationError',
					message: 'containerNotLoaded',
					type: 'warning',
				});
				return;
			}

			await fetch(`${API_BASE_URL}api/exports/setExported`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: oldExportId, is_exported: '1' }),
			});

			setPopup({
				isOpen: true,
				title: 'success',
				message: 'containerExportedSuccessfully',
				type: 'success',
			});
			setTimeout(() => {
				navigate('/view-containers');
			}, 2000);
		} catch (error) {
			console.error('Error:', error);
			setPopup({
				isOpen: true,
				title: 'error',
				message: 'errorCreatingContainer',
				type: 'error',
			});
		} finally {
			setExportLoading(false);
		}
	};

	const onSubmit = handleSubmit(async (data) => {
		try {
			await updateContainer(data);
		} catch (error) {
			console.error('Error:', error);
			setPopup({
				isOpen: true,
				title: 'error',
				message: 'errorCreatingContainer',
				type: 'error',
			});
		}
	});

	const closePopup = () => {
		setPopup({
			isOpen: false,
			title: '',
			message: '',
			type: 'info',
		});
	};

	return {
		control,
		optionsByFilter,
		onSubmit,
		setExported,
		popup,
		closePopup,
		submitLoading,
		exportLoading,
	};
};
