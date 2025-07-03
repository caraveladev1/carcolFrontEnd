import { useState, useEffect } from 'react';
import { containerService } from '../services/index.js';
import { dataTransformers, filterUtils } from '../utils/index.js';
import { ViewContainerRow } from '../components/ViewContainerRow.jsx';

export const useViewContainers = () => {
  const [organizedData, setOrganizedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    office: [],
    exportMonth: [],
    packaging: [],
    contract: [],
    destination: [],
    initialDate: '',
    finalDate: '',
    ico: '',
  });

  const [officeOptions, setOfficeOptions] = useState([]);
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedIco, setSelectedIco] = useState(null);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);

  const mapDataWithButtons = (data, role) => {
    return dataTransformers.mapViewContainerData(data).map(item => 
      ViewContainerRow({ item, role, onCommentsClick: handleCommentsButtonClick, onAnnouncementsClick: handleAnnouncementsButtonClick })
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

  const handleFilterChange = (e) => {
    const { name, value, multiple, selectedOptions } = e.target;
    const updatedValue = multiple ? [...selectedOptions].map((option) => option.value) : value;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name === 'initialDate' || name === 'finalDate' ? value : updatedValue,
    }));
  };

  const filteredData = () => {
    return filterUtils.filterViewContainerData(organizedData, filters);
  };

  return {
    organizedData,
    loading,
    filters,
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
    handleFilterChange,
    filteredData,
    setIsAnnouncementsOpen,
    mapDataWithButtons,
  };
};