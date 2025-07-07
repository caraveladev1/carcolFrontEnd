import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';
import { CONTAINER_CAPACITY } from '../constants/index.js';

export const useCreateContainer = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [icoList, setIcoList] = useState([]);
	const [filteredIcoList, setFilteredIcoList] = useState([]);
	const [selectedIcos, setSelectedIcos] = useState(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const [popup, setPopup] = useState({
		isOpen: false,
		title: '',
		message: '',
		type: 'info',
	});
	const itemsPerPage = 100;

	const [selectOptions, setSelectOptions] = useState({
		shipmentPorts: [],
		destinationPorts: [],
		exportCountry: [],
		capacityContainer: [],
		incoterm: [],
		originPort: [],
	});

	const {
		control,
		handleSubmit: handleFormSubmit,
		watch,
		reset,
	} = useForm({
		defaultValues: {
			port: '',
			exportCountry: '',
			capacityContainer: '',
			incoterm: '',
			shipmentMonthStart: '',
			shipmentMonthFinal: '',
			originPort: '',
		},
	});

	const filters = watch();

	const memoizedFilters = useMemo(
		() => filters,
		[
			filters.port,
			filters.exportCountry,
			filters.capacityContainer,
			filters.incoterm,
			filters.shipmentMonthStart,
			filters.shipmentMonthFinal,
			filters.originPort,
		],
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await containerService.getAllExports();

				const shipmentPorts = [...new Set(data.map((item) => item.shipment_port).filter(Boolean))];
				const destinationPorts = [...new Set(data.map((item) => item.destination_port).filter(Boolean))];
				const exportCountry = [...new Set(data.map((item) => item.origin_iso).filter(Boolean))];
				const originPort = [...new Set(data.map((item) => item.origin_port).filter(Boolean))];
				const capacityContainer = Object.keys(CONTAINER_CAPACITY);
				const incoterm = [...new Set(data.map((item) => item.incoterm).filter(Boolean))];

				const updatedIcoList = dataTransformers.mapCreateContainerData(data);

				setIcoList(updatedIcoList);
				setFilteredIcoList(updatedIcoList);

				setSelectOptions({
					shipmentPorts,
					destinationPorts,
					exportCountry,
					capacityContainer,
					incoterm,
					originPort,
				});
				setLoading(false);
			} catch (error) {
				console.error('Error:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleCheckboxChange = useCallback((ico_id) => {
		setSelectedIcos((prevSelectedIcos) => {
			const newSelectedIcos = new Set(prevSelectedIcos);
			if (newSelectedIcos.has(ico_id)) {
				newSelectedIcos.delete(ico_id);
			} else {
				newSelectedIcos.add(ico_id);
			}
			return newSelectedIcos;
		});
	}, []);

	useEffect(() => {
		if (icoList.length > 0) {
			const filteredList = filterUtils.filterCreateContainerData(icoList, memoizedFilters);

			setFilteredIcoList([
				...icoList.filter((item) => selectedIcos.has(item.ico_id)),
				...filteredList.filter((item) => !selectedIcos.has(item.ico_id)),
			]);
		}
	}, [memoizedFilters, icoList, selectedIcos]);

	const preparedDataTable = useMemo(() => {
		return filteredIcoList.map((item) => ({
			...item,
			select: (
				<input
					type='checkbox'
					checked={selectedIcos.has(item.ico_id)}
					onChange={() => handleCheckboxChange(item.ico_id)}
				/>
			),
		}));
	}, [filteredIcoList, selectedIcos, handleCheckboxChange]);

	const paginatedData = useMemo(() => {
		if (!preparedDataTable || preparedDataTable.length === 0) return [];
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return preparedDataTable.slice(startIndex, endIndex);
	}, [preparedDataTable, currentPage]);

	const totalItems = preparedDataTable?.length || 0;

	const goToPage = (page) => {
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleSubmit = handleFormSubmit(async (data) => {
		setSubmitLoading(true);
		const selectedData = icoList.filter((ico) => selectedIcos.has(ico.ico_id));

		// Validación: verificar que el país de exportación coincida con el país de origen de los ICOs seleccionados
		const exportCountry = data.exportCountry;
		const invalidIcos = selectedData.filter((ico) => ico.exportCountry !== exportCountry);

		if (invalidIcos.length > 0) {
			setPopup({
				isOpen: true,
				title: 'validationError',
				message: 'exportCountryMismatch',
				type: 'error',
			});
			setSubmitLoading(false);
			return; // No continuar con la creación del contenedor
		}

		const payload = {
			filters: data,
			selectedIcos: selectedData,
		};

		const sumIcosWeight = selectedData.reduce((accumulator, element) => accumulator + parseInt(element.weight, 10), 0);

		const selectedContainer = parseInt(payload.filters.capacityContainer, 10);
		const selectedContainerValue = CONTAINER_CAPACITY[selectedContainer];

		if (sumIcosWeight < selectedContainerValue) {
			try {
				await containerService.createContainer(payload);
				setPopup({
					isOpen: true,
					title: 'success',
					message: 'containerCreatedSuccessfully',
					type: 'success',
				});
				// Navegar después de un pequeño delay para que el usuario vea el mensaje
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
		} else {
			setPopup({
				isOpen: true,
				title: 'validationError',
				message: 'weightExceedsCapacity',
				type: 'error',
			});
			setSubmitLoading(false);
		}
	});

	const resetFilters = () => {
		reset({
			port: '',
			exportCountry: '',
			capacityContainer: '',
			incoterm: '',
			shipmentMonthStart: '',
			shipmentMonthFinal: '',
			originPort: '',
		});
		setSelectedIcos(new Set());
		setCurrentPage(1);
	};

	const closePopup = () => {
		setPopup({
			isOpen: false,
			title: '',
			message: '',
			type: 'info',
		});
	};

	return {
		loading,
		submitLoading,
		selectOptions,
		preparedDataTable,
		handleSubmit,
		handleCheckboxChange,
		control,
		paginatedData,
		currentPage,
		totalItems,
		goToPage,
		itemsPerPage,
		popup,
		closePopup,
		resetFilters,
	};
};
