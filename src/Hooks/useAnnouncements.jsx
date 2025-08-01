import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { usePersistedFilters } from './usePersistedFilters.jsx';
import { API_BASE_URL } from '../constants/api.js';

export const useAnnouncements = (onClose) => {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [popup, setPopup] = useState({
		isOpen: false,
		title: '',
		message: '',
		type: 'info',
	});
	const [filterOptions, setFilterOptions] = useState({
		packaging: [],
		originPort: [],
		ico: [],
		lotType: [],
	});
	const [totals, setTotals] = useState({
		totalEstimatedKg: 0,
		filteredEstimatedKg: 0,
		filteredUnits: 0,
		totalUnits: 0,
	});

	// --- Persistencia de filtros ---
	const FILTERS_KEY = 'announcementsFilters';
	const defaultFilterValues = {
		startDate: '',
		endDate: '',
		packaging: [],
		originPort: [],
		ico: [],
		lotType: [],
	};
	const { filters: persistedFilters, setFilters: setPersistedFilters } = usePersistedFilters({
		defaultValues: defaultFilterValues,
		storageKey: FILTERS_KEY,
	});

	// Resetear filtros tanto en el storage como en el formulario
	const resetAllFilters = () => {
		setPersistedFilters(defaultFilterValues);
		resetFilters(defaultFilterValues);
	};

	const {
		control: filterControl,
		watch: watchFilters,
		reset: resetFilters,
	} = useForm({
		defaultValues: persistedFilters,
	});

	// Sincronizar los cambios del formulario con el hook de filtros persistentes SOLO si cambian realmente
	const filters = watchFilters();
	const lastSyncedFilters = useRef(persistedFilters);
	useEffect(() => {
		// Solo sincroniza si los filtros realmente cambiaron respecto al storage
		const filtersStr = JSON.stringify(filters);
		const lastStr = JSON.stringify(lastSyncedFilters.current);
		if (filtersStr !== lastStr) {
			setPersistedFilters(filters);
			lastSyncedFilters.current = filters;
		}
	}, [filters, setPersistedFilters]);

	// Al montar, inicializar los filtros desde el storage si existen SOLO una vez
	const didInitFilters = useRef(false);
	useEffect(() => {
		if (!didInitFilters.current) {
			resetFilters(persistedFilters);
			didInitFilters.current = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [persistedFilters]);

	const {
		control: formControl,
		handleSubmit,
		setValue,
		reset: resetForm,
	} = useForm({
		defaultValues: {},
	});

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

				// Extract unique options for filters
				const packagingOptions = [...new Set(data.map((item) => item.contract_atlas?.packaging_type).filter(Boolean))];
				const originPortOptions = [...new Set(data.map((item) => item.origin_port).filter(Boolean))];
				const icoOptions = [...new Set(data.map((item) => item.ico).filter(Boolean))];
				const lotTypeOptions = [...new Set(data.map((item) => item.contract_atlas?.lot_type).filter(Boolean))];

				setFilterOptions({
					packaging: packagingOptions,
					originPort: originPortOptions,
					ico: icoOptions,
					lotType: lotTypeOptions,
				});

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
		setSubmitLoading(true);
		fetch(`${API_BASE_URL}api/exports/addAnnouncements`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then((response) => response.json())
			.then(() => {
				setPopup({
					isOpen: true,
					title: 'success',
					message: 'announcementsAddedSuccessfully',
					type: 'success',
				});
				setTimeout(() => {
					onClose?.();
				}, 2000);
			})
			.catch((error) => {
				console.error('Error:', error);
				setPopup({
					isOpen: true,
					title: 'error',
					message: 'errorSendingData',
					type: 'error',
				});
			})
			.finally(() => {
				setSubmitLoading(false);
			});
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
		data,
		filteredData,
		totals,
		filterControl,
		formControl,
		setValue,
		resetForm,
		submitAnnouncements,
		filterOptions,
		popup,
		closePopup,
		submitLoading,
		resetFilters: resetAllFilters,
	};
};
