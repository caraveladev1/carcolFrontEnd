import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../utils/consts';

export const useAnnouncements = (onClose) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({
    totalEstimatedKg: 0,
    filteredEstimatedKg: 0,
    filteredUnits: 0,
    totalUnits: 0
  });

  const { control: filterControl, watch: watchFilters } = useForm({
    defaultValues: {
      startDate: '',
      endDate: '',
      packaging: [],
      originPort: [],
      ico: [],
      lotType: []
    }
  });

  const { control: formControl, handleSubmit, setValue } = useForm({
    defaultValues: {}
  });

  const filters = watchFilters();

  const calculateTotals = () => {
    const totalKg = data.reduce((sum, item) => sum + (parseFloat(item.contract_atlas.estimated_kg) || 0), 0);
    const filteredKg = filteredData.reduce((sum, item) => sum + (parseFloat(item.contract_atlas.estimated_kg) || 0), 0);
    const totalUnitsSum = data.reduce((sum, item) => sum + (parseInt(item.contract_atlas.units) || 0), 0);
    const filteredUnitsSum = filteredData.reduce((sum, item) => sum + (parseInt(item.contract_atlas.units) || 0), 0);
    
    setTotals({
      totalEstimatedKg: totalKg,
      filteredEstimatedKg: filteredKg,
      totalUnits: totalUnitsSum,
      filteredUnits: filteredUnitsSum
    });
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}api/exports/getAnnouncements`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);

        data.forEach((item) => {
          setValue(`${item.ico}.announcement`, item.announcement || '');
          setValue(`${item.ico}.orders`, item.orders || '');
          setValue(`${item.ico}.revision_number`, item.revision_number || '');
          setValue(`${item.ico}.allocation`, item.allocation || '');
          setValue(`${item.ico}.sales_code`, item.sales_code || '');
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [setValue]);

  useEffect(() => {
    calculateTotals();
  }, [filteredData, data]);

  useEffect(() => {
    let filtered = [...data];

    if (filters.startDate || filters.endDate) {
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      filtered = filtered.filter((item) => {
        const date = new Date(item.date_landing);
        return (!start || date >= start) && (!end || date <= end);
      });
    }

    if (filters.packaging?.length > 0) {
      filtered = filtered.filter((item) => filters.packaging.includes(item.contract_atlas.packaging_type));
    }

    if (filters.originPort?.length > 0) {
      filtered = filtered.filter((item) => filters.originPort.includes(item.origin_port));
    }

    if (filters.ico?.length > 0) {
      filtered = filtered.filter((item) => filters.ico.includes(item.ico));
    }

    if (filters.lotType?.length > 0) {
      filtered = filtered.filter((item) => filters.lotType.includes(item.contract_atlas.lot_type));
    }

    setFilteredData(filtered);
  }, [filters, data]);

  const submitAnnouncements = handleSubmit((formData) => {
    fetch(`${API_BASE_URL}api/exports/addAnnouncements`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        window.alert('Announcements added successfully');
        onClose?.();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

  return {
    data,
    filteredData,
    totals,
    filterControl,
    formControl,
    submitAnnouncements,
  };
};