import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';
import { TABLE_HEADERS } from '../constants/tableHeaders.js';
import { useCommentNotifications } from './useCommentNotifications.jsx';
import { API_BASE_URL } from '../constants/api.js';
import { API_ENDPOINTS } from '../constants/api.js';
export const useExportedContainers = () => {
	const [organizedData, setOrganizedData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showDetails, setShowDetails] = useState(false);
	const [selectedExpId, setSelectedExpId] = useState(null);
	const [countryOptions, setCountryOptions] = useState([]);
	const [portOptions, setPortOptions] = useState([]);
	const [weightsTooltipVisible, setWeightsTooltipVisible] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [user, setUser] = useState('');

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
		filters.selectedHeaders && filters.selectedHeaders.length > 0 ? filters.selectedHeaders : TABLE_HEADERS.EXPORTED;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await containerService.getExportedContainers();
				const groupedData = dataTransformers.groupByExpId(data);
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
				setLoading(false);
			} catch (error) {
				console.error('Error:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleViewDetails = (exp_id) => {
		setSelectedExpId(exp_id);
		setShowDetails(true);
	};

	const closeDetails = () => {
		setShowDetails(false);
		setSelectedExpId(null);
	};

	const filteredData = () => {
		if (!organizedData) return {};
		return filterUtils.filterExportedContainerData(organizedData, filters);
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

	// Calculate weights data for tooltip
	const calculateWeightsData = (containerData) => {
		const packagingBreakdown = {};
		let totalWeight = 0;
		let totalPendingWeightsToMill = 0;
		let weightsInProgress = 0;
		let weightsFinished = 0;

		containerData.forEach((item) => {
			const weight = parseFloat(item.weight) || 0;
			const units = parseFloat(item.units) || 0;
			const packaging = item.packaging || 'Unknown';
			const millingState = item.milling_state || '';

			totalWeight += weight;

			// Sum units by packaging instead of weight
			if (!packagingBreakdown[packaging]) {
				packagingBreakdown[packaging] = 0;
			}
			packagingBreakdown[packaging] += units;

			// Calculate weights by milling state
			if (millingState !== 'initialized' && millingState !== 'closed' && millingState !== 'approved_qa') {
				totalPendingWeightsToMill += weight;
			}
			if (millingState === 'initialized' || millingState === 'approved_qa') {
				weightsInProgress += weight;
			}
			if (millingState === 'closed') {
				weightsFinished += weight;
			}
		});

		// Convert to array format for display (now showing units)
		const packagingArray = Object.entries(packagingBreakdown).map(([packaging, units]) => ({
			packaging,
			units: units.toFixed(0), // Show units as whole numbers
		}));

		// Calculate 69kg bags (rounded down)
		const totalBags = Math.floor(totalWeight / 69);

		// Calculate 60kg bags (rounded down)
		const total60kgBags = Math.floor(totalWeight / 60);

		return {
			packagingBreakdown: packagingArray,
			totalBags,
			total60kgBags,
			totalWeight: totalWeight.toFixed(2),
			totalPendingWeightsToMill: totalPendingWeightsToMill.toFixed(2),
			weightsInProgress: weightsInProgress.toFixed(2),
			weightsFinished: weightsFinished.toFixed(2),
		};
	};

	// Handle tooltip visibility
	const showWeightsTooltip = (expId) => {
		setWeightsTooltipVisible((prev) => ({ ...prev, [expId]: true }));
	};

	const hideWeightsTooltip = (expId) => {
		setWeightsTooltipVisible((prev) => ({ ...prev, [expId]: false }));
	};

	const toggleWeightsTooltip = (expId) => {
		setWeightsTooltipVisible((prev) => ({ ...prev, [expId]: !prev[expId] }));
	};

	const { getNotificationStatus, refreshNotifications } = useCommentNotifications(user);

	useEffect(() => {
		fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_USERNAME_FROM_TOKEN}`, {
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((data) => {
				setUser(data.username);
			})
			.catch((err) => console.error('Error obteniendo el usuario:', err));
	}, []);

	return {
		organizedData,
		loading,
		showDetails,
		selectedExpId,
		countryOptions,
		portOptions,
		handleViewDetails,
		closeDetails,
		filteredData,
		control,
		paginatedData,
		currentPage,
		totalItems,
		goToPage,
		itemsPerPage,
		resetFilters,
		weightsTooltipVisible,
		calculateWeightsData,
		showWeightsTooltip,
		hideWeightsTooltip,
		toggleWeightsTooltip,
		selectedHeaders,
		getNotificationStatus,
		refreshNotifications,
	};
};
