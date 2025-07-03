export const filterUtils = {
  filterPendingData(data, filters) {
    if (!data) return {};

    return Object.keys(data).reduce((result, exp_id) => {
      const filteredItems = data[exp_id].filter((item) => {
        const itemDate = new Date(item.date_landing);
        const withinDateRange =
          (!filters.initialDate || itemDate >= new Date(filters.initialDate)) &&
          (!filters.finalDate || itemDate <= new Date(filters.finalDate));

        const matchesExportCountry = 
          filters.exportCountry.length === 0 || filters.exportCountry.includes(item.origin);

        const matchesDestinationPort =
          filters.destinationPort.length === 0 ||
          (item.destinationContainer && filters.destinationPort.includes(item.destinationContainer));

        return withinDateRange && matchesExportCountry && matchesDestinationPort;
      });

      if (filteredItems.length > 0) {
        result[exp_id] = filteredItems;
      }
      return result;
    }, {});
  },

  filterViewContainerData(data, filters) {
    if (!data) return {};
    return Object.keys(data).reduce((filteredData, exp_id) => {
      const filteredItems = data[exp_id].filter((item) => {
        const itemDate = new Date(item.date_landing);

        const withinDateRange =
          (!filters.initialDate || itemDate >= new Date(filters.initialDate)) &&
          (!filters.finalDate || itemDate <= new Date(filters.finalDate));

        const matchesOffice = filters.office.length === 0 || filters.office.includes(item.office);
        const matchesPackaging = filters.packaging.length === 0 || filters.packaging.includes(item.packaging);
        const matchesContract = filters.contract.length === 0 || filters.contract.includes(item.contract);
        const matchesDestination = filters.destination.length === 0 || filters.destination.includes(item.destination);
        const matchesIco = !filters.ico || item.ico?.toLowerCase().includes(filters.ico.toLowerCase());

        return (
          withinDateRange && matchesOffice && matchesPackaging && matchesContract && matchesDestination && matchesIco
        );
      });

      if (filteredItems.length > 0) {
        filteredData[exp_id] = filteredItems;
      }
      return filteredData;
    }, {});
  },

  filterCreateContainerData(data, filters) {
    return data.filter((item) => {
      const shipmentMonth = new Date(item.shipmentMonth);
      const shipmentMonthStart = new Date(filters.shipmentMonthStart);
      const shipmentMonthFinal = new Date(filters.shipmentMonthFinal);
      
      return (
        (filters.port === '' || item.destinationPort === filters.port) &&
        (filters.exportCountry === '' || item.exportCountry === filters.exportCountry) &&
        (filters.incoterm === '' || item.incoterm === filters.incoterm) &&
        (filters.shipmentMonthStart === '' || shipmentMonth >= shipmentMonthStart) &&
        (filters.shipmentMonthFinal === '' || shipmentMonth <= shipmentMonthFinal)
      );
    });
  },

  filterEditContainerData(tableData, filters) {
    return tableData.filter((row) => {
      const shipmentDate = new Date(row.shipmentMonth);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (filters.selectedDestinationPorts.length === 0 || filters.selectedDestinationPorts.includes(row.destinationPort)) &&
        (!start || shipmentDate >= start) &&
        (!end || shipmentDate <= end) &&
        (filters.selectedIncoterm.length === 0 || filters.selectedIncoterm.includes(row.incoterm))
      );
    });
  },

  filterExportedContainerData(data, filters) {
    if (!data) return {};

    return Object.keys(data).reduce((result, exp_id) => {
      const filteredItems = data[exp_id].filter((item) => {
        const withinDateRange =
          (!filters.initialDate || new Date(item.date_landing) >= new Date(filters.initialDate)) &&
          (!filters.finalDate || new Date(item.date_landing) <= new Date(filters.finalDate));

        const matchesExportCountry = filters.exportCountry.length === 0 || filters.exportCountry.includes(item.origin);

        const matchesDestinationPort =
          filters.destinationPort.length === 0 ||
          (item.destinationContainer && filters.destinationPort.includes(item.destinationContainer));

        return withinDateRange && matchesExportCountry && matchesDestinationPort;
      });

      if (filteredItems.length > 0) {
        result[exp_id] = filteredItems;
      }
      return result;
    }, {});
  }
};