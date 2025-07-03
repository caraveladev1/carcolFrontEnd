import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';

export const useEditContainer = () => {
  const { id } = useParams();
  const [state, setState] = useState({
    loading: true,
    tableData: [],
    selectedIcos: [],
    filtersData: [],
    selectedDestinationPorts: [],
    startDate: '',
    endDate: '',
    selectedIncoterm: [],
  });

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

  const handleDestinationPortChange = (e) => {
    const { value } = e.target;
    setState((prevState) => ({ ...prevState, selectedDestinationPorts: value }));
  };

  const handleIncotermChange = (e) => {
    const { value } = e.target;
    setState((prevState) => ({ ...prevState, selectedIncoterm: value }));
  };

  const handleStartDateChange = (e) => {
    setState((prevState) => ({ ...prevState, startDate: e.target.value }));
  };

  const handleEndDateChange = (e) => {
    setState((prevState) => ({ ...prevState, endDate: e.target.value }));
  };

  const filteredTableData = () => {
    return filterUtils.filterEditContainerData(state.tableData, {
      selectedDestinationPorts: state.selectedDestinationPorts,
      startDate: state.startDate,
      endDate: state.endDate,
      selectedIncoterm: state.selectedIncoterm,
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

  return {
    state,
    handleDestinationPortChange,
    handleIncotermChange,
    handleStartDateChange,
    handleEndDateChange,
    filteredTableData,
    handleCheckboxChange,
  };
};