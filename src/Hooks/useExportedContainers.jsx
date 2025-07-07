import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';

export const useExportedContainers = () => {
	const [organizedData, setOrganizedData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showDetails, setShowDetails] = useState(false);
	const [selectedExpId, setSelectedExpId] = useState(null);
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
		},
	});

	const filters = watch();

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
	};
};
