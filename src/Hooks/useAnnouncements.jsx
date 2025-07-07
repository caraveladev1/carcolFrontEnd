import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../utils/consts';

export const useAnnouncements = (onClose) => {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [totals, setTotals] = useState({
		totalEstimatedKg: 0,
		filteredEstimatedKg: 0,
		filteredUnits: 0,
		totalUnits: 0,
	});

	const { control: filterControl, watch: watchFilters } = useForm({
		defaultValues: {
			startDate: '',
			endDate: '',
			packaging: [],
			originPort: [],
			ico: [],
			lotType: [],
		},
	});

	const {
		control: formControl,
		handleSubmit,
		setValue,
	} = useForm({
		defaultValues: {},
	});

	const filters = watchFilters();

	const memoizedFilters = useMemo(
		() => filters,
		[filters.startDate, filters.endDate, filters.packaging, filters.originPort, filters.ico, filters.lotType],
	);

	const calculateTotals = useCallback(() => {
		const totalKg = data.reduce((sum, item) => sum + (parseFloat(item.contract_atlas.estimated_kg) || 0), 0);
		const filteredKg = filteredData.reduce((sum, item) => sum + (parseFloat(item.contract_atlas.estimated_kg) || 0), 0);
		const totalUnitsSum = data.reduce((sum, item) => sum + (parseInt(item.contract_atlas.units) || 0), 0);
		const filteredUnitsSum = filteredData.reduce((sum, item) => sum + (parseInt(item.contract_atlas.units) || 0), 0);

		setTotals({
			totalEstimatedKg: totalKg,
			filteredEstimatedKg: filteredKg,
			totalUnits: totalUnitsSum,
			filteredUnits: filteredUnitsSum,
		});
	}, [data, filteredData]);

	useEffect(() => {
		fetch(`${API_BASE_URL}api/exports/getAnnouncements`)
			.then((response) => response.json())
			.then((data) => {
				setData(data);
				setFilteredData(data);

				data.forEach((item) => {
					setValue(`${item.ico}.announcement`, item.announcement || '');
					setValue(`${item.ico}.orders`, item.orders || '');
					setValue(`${item.ico}.revision_number`, item.revision_number || '');
					setValue(`${item.ico}.allocation`, item.allocation || '');
					setValue(`${item.ico}.sales_code`, item.sales_code || '');
				});
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}, [setValue]);

	useEffect(() => {
		calculateTotals();
	}, [filteredData, data]);

	useEffect(() => {
		let filtered = [...data];

		if (memoizedFilters.startDate || memoizedFilters.endDate) {
			const start = memoizedFilters.startDate ? new Date(memoizedFilters.startDate) : null;
			const end = memoizedFilters.endDate ? new Date(memoizedFilters.endDate) : null;

			filtered = filtered.filter((item) => {
				const date = new Date(item.date_landing);
				return (!start || date >= start) && (!end || date <= end);
			});
		}

		if (memoizedFilters.packaging?.length > 0) {
			filtered = filtered.filter((item) => memoizedFilters.packaging.includes(item.contract_atlas.packaging_type));
		}

		if (memoizedFilters.originPort?.length > 0) {
			filtered = filtered.filter((item) => memoizedFilters.originPort.includes(item.origin_port));
		}

		if (memoizedFilters.ico?.length > 0) {
			filtered = filtered.filter((item) => memoizedFilters.ico.includes(item.ico));
		}

		if (memoizedFilters.lotType?.length > 0) {
			filtered = filtered.filter((item) => memoizedFilters.lotType.includes(item.contract_atlas.lot_type));
		}

		setFilteredData(filtered);
	}, [memoizedFilters, data]);

	const submitAnnouncements = handleSubmit((formData) => {
		fetch(`${API_BASE_URL}api/exports/addAnnouncements`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then((response) => response.json())
			.then(() => {
				window.alert('Announcements added successfully');
				onClose?.();
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	});

	return {
		data,
		filteredData,
		totals,
		filterControl,
		formControl,
		submitAnnouncements,
	};
};
