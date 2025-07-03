import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';
import { CONTAINER_CAPACITY } from '../constants/index.js';

export const useCreateContainer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [icoList, setIcoList] = useState([]);
  const [filteredIcoList, setFilteredIcoList] = useState([]);
  const [selectedIcos, setSelectedIcos] = useState(new Set());

  const [selectOptions, setSelectOptions] = useState({
    shipmentPorts: [],
    destinationPorts: [],
    exportCountry: [],
    capacityContainer: [],
    incoterm: [],
    originPort: [],
  });

  const [filters, setFilters] = useState({
    port: '',
    exportCountry: '',
    capacityContainer: '',
    incoterm: '',
    shipmentMonthStart: '',
    shipmentMonthFinal: '',
    originPort: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await containerService.getAllExports();
        
        const shipmentPorts = [...new Set(data.map((item) => item.shipment_port))];
        const destinationPorts = [...new Set(data.map((item) => item.destination_port))];
        const exportCountry = [...new Set(data.map((item) => item.origin_iso))];
        const originPort = [...new Set(data.map((item) => item.origin_port))];
        const capacityContainer = [20, 40];
        const incoterm = [...new Set(data.map((item) => item.incoterm))];

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

  const handleCheckboxChange = (ico_id) => {
    setSelectedIcos((prevSelectedIcos) => {
      const newSelectedIcos = new Set(prevSelectedIcos);
      if (newSelectedIcos.has(ico_id)) {
        newSelectedIcos.delete(ico_id);
      } else {
        newSelectedIcos.add(ico_id);
      }
      return newSelectedIcos;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    const filteredList = filterUtils.filterCreateContainerData(icoList, filters);
    
    // Combine and sort: selected items first, then filtered items
    setFilteredIcoList([
      ...icoList.filter((item) => selectedIcos.has(item.ico_id)),
      ...filteredList.filter((item) => !selectedIcos.has(item.ico_id)),
    ]);
  }, [filters, icoList, selectedIcos]);

  const preparedDataTable = filteredIcoList.map((item) => ({
    ...item,
    select: (
      <input
        type='checkbox'
        checked={selectedIcos.has(item.ico_id)}
        onChange={() => handleCheckboxChange(item.ico_id)}
      />
    ),
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedData = icoList.filter((ico) => selectedIcos.has(ico.ico_id));

    const payload = {
      filters,
      selectedIcos: selectedData,
    };

    const sumIcosWeight = selectedData.reduce((accumulator, element) => 
      accumulator + parseInt(element.weight, 10), 0);

    const selectedContainer = parseInt(payload.filters.capacityContainer, 10);
    const selectedContainerValue = CONTAINER_CAPACITY[selectedContainer];

    if (sumIcosWeight < selectedContainerValue) {
      try {
        await containerService.createContainer(payload);
        window.alert('Container created successfully');
        navigate('/view-containers');
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      window.alert('The total weight of the icos exceeds the capacity of the container.');
    }
  };

  return {
    loading,
    selectOptions,
    filters,
    preparedDataTable,
    handleFilterChange,
    handleSubmit,
    handleCheckboxChange,
  };
};