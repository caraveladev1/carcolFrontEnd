import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';
import { TABLE_HEADERS } from '../constants/tableHeaders.js';

export const usePendingTasks = () => {
	const [organizedData, setOrganizedData] = useState(null);
	const [expId, setExpId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showBookingAndDates, setShowBookingAndDates] = useState({});
	const [initialFormData, setInitialFormData] = useState({});
	const [countryOptions, setCountryOptions] = useState([]);
	const [portOptions, setPortOptions] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const { control, watch, reset } = useForm({
		defaultValues: {
			initialDate: '',
			finalDate: '',
			exportCountry: [],
			destinationPort: [],
			selectedHeaders: [], // Por defecto deseleccionado
		},
	});

	const filters = watch();
	// Headers seleccionados para mostrar en la tabla
	const selectedHeaders =
		filters.selectedHeaders && filters.selectedHeaders.length > 0 ? filters.selectedHeaders : TABLE_HEADERS.PENDING;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [pendingData, exportsData] = await Promise.all([
					containerService.getPendingContainers(),
					containerService.getAllExports(),
				]);

				// Process pending containers
				const groupedData = dataTransformers.groupByExpId(pendingData);
				const mappedData = {};
				Object.keys(groupedData).forEach((exp_id) => {
					mappedData[exp_id] = dataTransformers.mapPendingTaskData(groupedData[exp_id]);
				});

				// Extract unique options
				const countries = dataTransformers.extractUniqueOptions(mappedData, 'export_country');
				const ports = dataTransformers.extractUniqueOptions(mappedData, 'destination_port');

				setCountryOptions(countries);
				setPortOptions(ports);
				setOrganizedData(mappedData);

				// Process exports data
				const exportNumbers = exportsData.map((item) => item.export_number);
				setExpId(exportNumbers);

				setLoading(false);
			} catch (error) {
				console.error('Error:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const toggleBookingAndDates = (exp_id) => {
		setShowBookingAndDates((prevState) => ({
			...prevState,
			[exp_id]: !prevState[exp_id],
		}));
		setInitialFormData((prevState) => ({
			...prevState,
			[exp_id]: {
				booking: organizedData[exp_id]?.[0].booking || undefined,
				exportDate: organizedData[exp_id]?.[0].export_date || undefined,
				dateLandingPort: organizedData[exp_id]?.[0].date_landing || undefined,
				estimatedDelivery: organizedData[exp_id]?.[0].estimated_delivery || undefined,
				estimatedArrival: organizedData[exp_id]?.[0].estimated_arrival || undefined,
				announcement: organizedData[exp_id]?.[0].announcement || undefined,
				order: organizedData[exp_id]?.[0].orders || undefined,
				review: organizedData[exp_id]?.[0].review || undefined,
				salesCode: organizedData[exp_id]?.[0].sales_code || undefined,
				exportId: organizedData[exp_id]?.[0].exp_id || undefined,
			},
		}));
	};

	const filteredData = () => {
		if (!organizedData) return {};
		return filterUtils.filterPendingData(organizedData, filters);
	};

	const paginatedData = useMemo(() => {
		if (!organizedData) return [];
		const filtered = filteredData();
		const entries = Object.entries(filtered || {});
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return entries.slice(startIndex, endIndex);
	}, [organizedData, filters, currentPage]);

	const totalItems = useMemo(() => {
		if (!organizedData) return 0;
		const filtered = filteredData();
		return Object.keys(filtered || {}).length;
	}, [organizedData, filters]);

	const goToPage = (page) => {
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const resetFilters = () => {
		// Reset form values
		reset({
			initialDate: '',
			finalDate: '',
			exportCountry: [],
			destinationPort: [],
		});
		setCurrentPage(1);
	};

	return {
		organizedData,
		expId,
		loading,
		showBookingAndDates,
		initialFormData,
		countryOptions,
		portOptions,
		toggleBookingAndDates,
		filteredData,
		control,
		paginatedData,
		currentPage,
		totalItems,
		goToPage,
		itemsPerPage,
		resetFilters,
		selectedHeaders,
	};
};
