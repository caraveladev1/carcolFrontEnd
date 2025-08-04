import { useState, useEffect, useMemo } from 'react';
import { usePersistedFilters } from './usePersistedFilters.jsx';
import { useForm } from 'react-hook-form';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';
import { ViewContainerRow } from '../components/ViewContainerRow.jsx';
import { useCommentNotifications } from './useCommentNotifications.jsx';
import { API_BASE_URL } from '../constants/api.js';
import { useCustomContainerOrder } from './useContainerReorder';

import { TABLE_HEADERS } from '../constants/tableHeaders.js';

const FILTERS_KEY = 'viewContainersFilters';

function serializeFilters(filters) {
	return encodeURIComponent(JSON.stringify(filters));
}

function deserializeFilters(str) {
	try {
		return JSON.parse(decodeURIComponent(str));
	} catch {
		return {};
	}
}

export const useViewContainers = () => {
	// Obtener los valores iniciales de los filtros desde la URL o sessionStorage (parámetros individuales)
	// Usar el hook centralizado para filtros persistentes
	const defaultValues = {
		office: [],
		exportMonth: [],
		packaging: [],
		contract: [],
		destination: [],
		initialDate: '',
		finalDate: '',
		ico: '',
		selectedHeaders: [],
	};
	const { filters, setFilters } = usePersistedFilters({ defaultValues, storageKey: FILTERS_KEY });
	const { applyCustomOrder } = useCustomContainerOrder();

	const [organizedData, setOrganizedData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState('');

	const {
		unreadComments,
		icosWithComments,
		markAsRead,
		hasUnreadComments,
		hasComments,
		getNotificationStatus,
		refreshNotifications,
	} = useCommentNotifications(user);

	const { control, watch, reset, setValue, getValues } = useForm({
		defaultValues: filters,
	});

	// Sincronizar los cambios del formulario con el hook de filtros
	useEffect(() => {
		const subscription = watch((values) => {
			setFilters(values);
		});
		return () => subscription.unsubscribe();
	}, [watch, setFilters]);

	// Guardar los filtros en sessionStorage y URL como parámetros individuales
	useEffect(() => {
		sessionStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (Array.isArray(value) && value.length > 0) {
				params.set(key, value.join(','));
			} else if (typeof value === 'string' && value) {
				params.set(key, value);
			}
		});
		window.history.replaceState(
			{},
			'',
			`${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`,
		);
	}, [filters]);

	const [officeOptions, setOfficeOptions] = useState([]);
	const [packagingOptions, setPackagingOptions] = useState([]);
	const [contractOptions, setContractOptions] = useState([]);
	const [destinationOptions, setDestinationOptions] = useState([]);
	const [millingStateOptions, setMillingStateOptions] = useState([]);
	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const [selectedIco, setSelectedIco] = useState(null);
	const [weightsTooltipVisible, setWeightsTooltipVisible] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [isReorderPopupOpen, setIsReorderPopupOpen] = useState(false);

	const mapDataWithButtons = (data, role) => {
		const getDateLandingColor = (dateLanding) => {
			if (!dateLanding) return 'text-celeste';
			const today = new Date();
			const [year, month, day] = dateLanding.split('-');
			const landingDate = new Date(Number(year), Number(month) - 1, Number(day));
			today.setHours(0, 0, 0, 0);
			landingDate.setHours(0, 0, 0, 0);
			const diffDays = Math.ceil((landingDate - today) / (1000 * 60 * 60 * 24));

			// Cuando falten 2 días o menos para la fecha de cargue
			if (diffDays <= 2 && diffDays >= 0) return 'text-naranja';

			// Cuando falten entre 3 y 8 días para la fecha de cargue
			if (diffDays >= 3 && diffDays <= 8) return 'text-yellow';

			// Cuando la fecha de cargue sea superior a 8 días
			if (diffDays > 8) return 'text-verde2';

			// Si la fecha ya pasó
			if (diffDays < 0) return 'text-celeste';

			// Por defecto
			return 'text-celeste';
		};

		const formatDateShort = (dateLanding) => {
			if (!dateLanding) return '';
			const [year, month, day] = dateLanding.split('-');
			return `${day}/${month}/${year}`;
		};

		return dataTransformers.mapViewContainerData(data).map((item) => {
			return ViewContainerRow({
				item: {
					...item,
					date_landing_color: getDateLandingColor(item.date_landing),
					date_landing_short: formatDateShort(item.date_landing),
				},
				role,
				onCommentsClick: handleCommentsButtonClick,
				getNotificationStatus,
			});
		});
	};

	// Obtener usuario al cargar el componente
	useEffect(() => {
		fetch(`${API_BASE_URL}api/exports/getUsernameFromToken`, {
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((data) => {
				setUser(data.username);
			})
			.catch((err) => console.error('Error obteniendo el usuario:', err));
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await containerService.getAllContainers();
				const groupedData = dataTransformers.groupByExpId(data);
				let mappedData = {};

				// Map data and get minimum date for each group
				Object.keys(groupedData).forEach((exp_id) => {
					mappedData[exp_id] = dataTransformers.mapViewContainerData(groupedData[exp_id]);
				});

				// Sort groups by minimum date
				mappedData = dataTransformers.sortGroupsByMinDate(mappedData);

				// Extract unique options
				const office = dataTransformers.extractUniqueOptions(mappedData, 'office');
				const destination = dataTransformers.extractUniqueOptions(mappedData, 'destination');
				const packaging = dataTransformers.extractUniqueOptions(mappedData, 'packaging');
				const contract = dataTransformers.extractUniqueOptions(mappedData, 'contract');
				const millingStates = dataTransformers.extractUniqueOptions(mappedData, 'milling_state');

				setOfficeOptions(office);
				setDestinationOptions(destination);
				setPackagingOptions(packaging);
				setContractOptions(contract);
				setMillingStateOptions(millingStates.map((state) => ({ value: state, label: state })));
				setOrganizedData(mappedData);
				setLoading(false);
			} catch (error) {
				console.error('Error:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleCommentsButtonClick = async (item) => {
		//console.log('🖱️ Click en comentarios para ICO:', item.ico);
		//console.log('📊 Estado actual de unread antes:', hasUnreadComments(item.ico));

		setSelectedIco(item.ico);
		setIsCommentsOpen(true);

		// Marcar como leído cuando se abre el modal
		await markAsRead(item.ico);

		//console.log('📊 Estado actual de unread después:', hasUnreadComments(item.ico));
	};

	const closeComments = () => {
		setIsCommentsOpen(false);
		setSelectedIco(null);
	};

	const filteredData = () => {
		if (!organizedData) return {};
		let filtered = filterUtils.filterViewContainerData(organizedData, filters);
		if (filters.milling_state && filters.milling_state.length > 0) {
			filtered = Object.fromEntries(
				Object.entries(filtered)
					.map(([exp_id, containerData]) => [
						exp_id,
						containerData.filter((item) => filters.milling_state.includes(item.milling_state)),
					])
					.filter(([_, containerData]) => containerData.length > 0),
			);
		}

		// Add minDateLanding to each group for custom ordering
		Object.keys(filtered).forEach((exp_id) => {
			const minDateLanding =
				filtered[exp_id]
					.filter((item) => item.date_landing)
					.map((item) => new Date(item.date_landing).getTime())
					.sort((a, b) => a - b)[0] || null;
			filtered[exp_id].minDateLanding = minDateLanding;
		});

		// Apply custom order to the filtered data
		return applyCustomOrder(filtered);
	};

	// Headers seleccionados para mostrar en la tabla
	const selectedHeaders =
		filters.selectedHeaders && filters.selectedHeaders.length > 0 ? filters.selectedHeaders : TABLE_HEADERS.VIEW;

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
			office: [],
			exportMonth: [],
			packaging: [],
			contract: [],
			destination: [],
			initialDate: '',
			finalDate: '',
			ico: '',
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

		// Calculate total units from all packaging breakdown
		const totalUnits = packagingArray.reduce((sum, item) => sum + Number(item.units || 0), 0);

		return {
			packagingBreakdown: packagingArray,
			totalBags,
			total60kgBags,
			totalUnits,
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

	// Container reorder functions
	const openReorderPopup = () => {
		setIsReorderPopupOpen(true);
	};

	const closeReorderPopup = () => {
		setIsReorderPopupOpen(false);
	};

	const handleReorderSave = (newOrder) => {
		// Force a re-render by updating the organizedData
		// The order is already saved in localStorage by the component
		setOrganizedData((prev) => ({ ...prev }));
	};

	// Prepare containers data for reorder popup (use all data, not filtered)
	const containersForReorder = useMemo(() => {
		if (!organizedData) return [];

		// Use organizedData directly instead of filteredData to show all containers
		const allData = { ...organizedData };

		// Add minDateLanding to each group
		Object.keys(allData).forEach((exp_id) => {
			const minDateLanding =
				allData[exp_id]
					.filter((item) => item.date_landing)
					.map((item) => new Date(item.date_landing).getTime())
					.sort((a, b) => a - b)[0] || null;
			allData[exp_id].minDateLanding = minDateLanding;
		});

		const result = Object.entries(allData).map(([exp_id, containerData]) => ({
			exp_id,
			loading_to_port: containerData[0]?.date_landing || null,
			// Add minDateLanding for sorting
			minDateLanding: containerData.minDateLanding || null,
		}));

		// Show summary in console for debugging
		const totalContainers = result.length;
		const withDates = result.filter((c) => c.loading_to_port).length;
		const pastDates = result.filter((c) => c.loading_to_port && new Date(c.loading_to_port) < new Date()).length;
		const futureDates = result.filter((c) => c.loading_to_port && new Date(c.loading_to_port) >= new Date()).length;

		/* console.log(`📊 Container Summary - Total: ${totalContainers}, With dates: ${withDates}, Past: ${pastDates}, Future: ${futureDates}`); */

		return result;
	}, [organizedData]);

	return {
		organizedData,
		loading,
		officeOptions,
		packagingOptions,
		contractOptions,
		destinationOptions,
		millingStateOptions,
		isCommentsOpen,
		selectedIco,
		handleCommentsButtonClick,
		closeComments,
		filteredData,
		mapDataWithButtons,
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
		refreshNotifications,
		hasUnreadComments,
		hasComments,
		getNotificationStatus,
		selectedHeaders,
		setValue,
		getValues,
		isReorderPopupOpen,
		openReorderPopup,
		closeReorderPopup,
		handleReorderSave,
		containersForReorder,
	};
};
