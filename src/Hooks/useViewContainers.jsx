import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';
import { ViewContainerRow } from '../components/ViewContainerRow.jsx';

export const useViewContainers = () => {
	const [organizedData, setOrganizedData] = useState(null);
	const [loading, setLoading] = useState(true);

	const { control, watch, reset } = useForm({
		defaultValues: {
			office: [],
			exportMonth: [],
			packaging: [],
			contract: [],
			destination: [],
			initialDate: '',
			finalDate: '',
			ico: '',
		},
	});

	const filters = watch();

	const [officeOptions, setOfficeOptions] = useState([]);
	const [packagingOptions, setPackagingOptions] = useState([]);
	const [contractOptions, setContractOptions] = useState([]);
	const [destinationOptions, setDestinationOptions] = useState([]);
	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const [selectedIco, setSelectedIco] = useState(null);
	const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const mapDataWithButtons = (data, role) => {
		return dataTransformers
			.mapViewContainerData(data)
			.map((item) =>
				ViewContainerRow({
					item,
					role,
					onCommentsClick: handleCommentsButtonClick,
					onAnnouncementsClick: handleAnnouncementsButtonClick,
				}),
			);
	};

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

				setOfficeOptions(office);
				setDestinationOptions(destination);
				setPackagingOptions(packaging);
				setContractOptions(contract);
				setOrganizedData(mappedData);
				setLoading(false);
			} catch (error) {
				console.error('Error:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleCommentsButtonClick = (item) => {
		setSelectedIco(item.ico);
		setIsCommentsOpen(true);
	};

	const handleAnnouncementsButtonClick = (item) => {
		setSelectedIco(item.ico);
		setIsAnnouncementsOpen(true);
	};

	const closeComments = () => {
		setIsCommentsOpen(false);
		setSelectedIco(null);
	};

	const closeAnnouncements = () => {
		setIsAnnouncementsOpen(false);
		setSelectedIco(null);
	};

	const filteredData = () => {
		if (!organizedData) return {};
		return filterUtils.filterViewContainerData(organizedData, filters);
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

	return {
		organizedData,
		loading,
		officeOptions,
		packagingOptions,
		contractOptions,
		destinationOptions,
		isCommentsOpen,
		selectedIco,
		isAnnouncementsOpen,
		handleCommentsButtonClick,
		handleAnnouncementsButtonClick,
		closeComments,
		closeAnnouncements,
		filteredData,
		setIsAnnouncementsOpen,
		mapDataWithButtons,
		control,
		paginatedData,
		currentPage,
		totalItems,
		goToPage,
		itemsPerPage,
		resetFilters,
	};
};
