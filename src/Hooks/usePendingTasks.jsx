import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';

export const usePendingTasks = () => {
  const [organizedData, setOrganizedData] = useState(null);
  const [expId, setExpId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingAndDates, setShowBookingAndDates] = useState({});
  const [initialFormData, setInitialFormData] = useState({});
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
        const [pendingData, exportsData] = await Promise.all([
          containerService.getPendingContainers(),
          containerService.getAllExports()
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
    return filterUtils.filterPendingData(organizedData, filters);
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
  };
};