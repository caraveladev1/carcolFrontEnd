import { useState, useEffect } from 'react';
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

  const { control, watch } = useForm({
    defaultValues: {
      initialDate: '',
      finalDate: '',
      exportCountry: [],
      destinationPort: [],
    }
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
    return filterUtils.filterExportedContainerData(organizedData, filters);
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
  };
};