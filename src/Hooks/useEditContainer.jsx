import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';

export const useEditContainer = () => {
	const { id } = useParams();
	const [state, setState] = useState({
		loading: true,
		tableData: [],
		selectedIcos: [],
		filtersData: [],
	});

	const { control, watch, reset } = useForm({
		defaultValues: {
			destinationPort: [],
			incoterm: [],
			startDate: '',
			endDate: '',
		},
	});

	const filters = watch();

	const fetchContainerData = useCallback(async () => {
		try {
			const data = await containerService.getEditContainerData(id);
			const selectedIcosFromContainers = data.containers.map((container) => {
				return container.contract_atlas ?? { ico: container.ico };
			});

			const combinedData = [...data.containers, ...data.contract_atlas];

			setState((prevState) => ({
				...prevState,
				filtersData: data,
				tableData: dataTransformers.mapEditContainerData(combinedData, selectedIcosFromContainers),
				selectedIcos: selectedIcosFromContainers,
				loading: false,
			}));
		} catch (error) {
			console.error('Error fetching container data:', error);
			setState((prevState) => ({ ...prevState, loading: false }));
		}
	}, [id]);

	useEffect(() => {
		fetchContainerData();
	}, [fetchContainerData]);

	const filteredTableData = () => {
		return filterUtils.filterEditContainerData(state.tableData, {
			selectedDestinationPorts: filters.destinationPort,
			startDate: filters.startDate,
			endDate: filters.endDate,
			selectedIncoterm: filters.incoterm,
		});
	};

	const handleCheckboxChange = useCallback((ico) => {
		setState((prevState) => {
			const isSelected = prevState.selectedIcos.some((selected) => selected.ico === ico);
			const associatedData = prevState.filtersData.contract_atlas.find((atlas) => atlas.ico === ico);

			const updatedIcos = isSelected
				? prevState.selectedIcos.filter((selected) => selected.ico !== ico)
				: [...prevState.selectedIcos, associatedData];

			return { ...prevState, selectedIcos: updatedIcos };
		});
	}, []);

	const resetFilters = () => {
		reset({
			destinationPort: [],
			incoterm: [],
			startDate: '',
			endDate: '',
		});
	};

	return {
		state,
		filteredTableData,
		handleCheckboxChange,
		control,
		resetFilters,
	};
};
