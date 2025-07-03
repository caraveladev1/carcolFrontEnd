import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { containerCapacity, API_BASE_URL } from '../utils/consts';

export const useFiltersEditContainer = (filterValues, selectedIcos, oldExportId) => {
  const navigate = useNavigate();
  const { containers: defaultValues, contract_atlas: optionValues } = filterValues;

  const containerLabels = Object.keys(containerCapacity);

  const defaultValuesFormatted = {
    booking: defaultValues[0]?.booking || '',
    dateLandingPort: defaultValues[0]?.date_landing || '',
    capacityContainer: defaultValues[0]?.container_capacity || '',
    estimatedArrival: defaultValues[0]?.estimated_arrival || '',
    port: defaultValues[0]?.destination_port || '',
    originPort: defaultValues[0]?.origin_port || '',
    exportDate: defaultValues[0]?.export_date || '',
    incoterm: defaultValues[0]?.incoterm || '',
    exportId: defaultValues[0]?.exp_id || '',
  };

  const optionsByFilter = {
    capacityContainer: containerLabels,
    port: [...new Set(optionValues.map((option) => option.destination_port || 'N/A'))],
    originPort: [...new Set(optionValues.map((option) => option.origin_port || 'N/A'))],
    incoterm: [...new Set(optionValues.map((option) => option.incoterm || 'N/A'))],
    exportId: [...new Set(defaultValues?.map((item) => item?.contract_atlas?.export).filter(Boolean))],
  };

  const { control, handleSubmit } = useForm({
    defaultValues: defaultValuesFormatted
  });

  const updateContainer = async (data) => {
    const payload = {
      old_id: oldExportId,
      states: defaultValues[0],
      selectedIcos: selectedIcos,
      filters: data,
    };

    if (defaultValues[0]?.is_pending === '1') {
      const limitedPayload = {
        old_id: parseInt(oldExportId),
        filters: {
          exportDate: data.exportDate,
          estimatedArrival: data.estimatedArrival,
        },
      };

      const response = await fetch(`${API_BASE_URL}api/exports/updateContainerAfterLoaded`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(limitedPayload),
      });

      if (!response.ok || !limitedPayload.filters.exportDate || !limitedPayload.filters.estimatedArrival) {
        window.alert('The container is loaded, you only update "Estimated Arrival" and "Export date". Please fill in the required fields');
        throw new Error('Missing required date fields');
      }

      window.alert('Container updated successfully. \n\nPlease noted: The container is loaded, only going to be updated "Estimated Arrival" and "Export date" fields.');
      navigate('/view-containers');
      return;
    }

    const sumIcosWeight = payload.selectedIcos.reduce((acc, element) => 
      acc + (parseInt(element.estimated_kg, 10) || 0), 0);

    const selectedContainerValue = containerCapacity[payload.filters.capacityContainer];

    if (!selectedContainerValue) {
      window.alert('Invalid container capacity selected.');
      return;
    }

    if (sumIcosWeight > selectedContainerValue) {
      window.alert('The total weight of the ICOs exceeds the capacity of the container.');
      return;
    }

    const response = await fetch(`${API_BASE_URL}api/exports/updateContainer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    window.alert('Container created successfully');
    navigate('/view-containers');
  };

  const setExported = async () => {
    if (defaultValues[0].is_pending !== '1') {
      window.alert('Container is not loaded');
      return;
    }

    await fetch(`${API_BASE_URL}api/exports/setExported`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: oldExportId, is_exported: '1' }),
    });

    window.alert('Container set as exported successfully');
    navigate('/view-containers');
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateContainer(data);
    } catch (error) {
      console.error('Error:', error);
    }
  });

  return {
    control,
    optionsByFilter,
    onSubmit,
    setExported,
  };
};