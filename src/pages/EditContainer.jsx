import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Banner } from '../components/Banner';
import { Loader } from '../components/Loader';
import { TableGeneric } from '../components/TableGeneric';
import { FiltersEditContainer } from '../components/FiltersEditContainer';
import { API_BASE_URL, headersTableEditContainer } from '../utils/consts';
import { InputGeneric } from '../components/InputGeneric';

export const EditContainer = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { t } = useTranslation();

	const [state, setState] = useState({
		loading: true,
		tableData: [],
		selectedIcos: [],
		filtersData: [],
		selectedDestinationPorts: [],
		startDate: '',
		endDate: '',
	});

	const fetchContainerData = useCallback(async () => {
		try {
			const response = await fetch(`${API_BASE_URL}api/exports/getEditContainerData/${id}`);
			if (!response.ok) throw new Error('Failed to fetch container data');

			const data = await response.json();
			const selectedIcosFromContainers = data.containers.map((container) => container.contract_atlas);
			const combinedData = [...data.containers, ...data.contract_atlas];

			setState((prevState) => ({
				...prevState,
				filtersData: data,
				tableData: formatTableData(combinedData, selectedIcosFromContainers),
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

	const formatTableData = (data, selectedIcos) => {
		return data.map((entry) => {
			const atlasData = entry.contract_atlas || entry;
			return {
				shipmentMonth: atlasData.shipment_date,
				ico_id: atlasData.ico,
				secondary_ico_id: atlasData.secondary_ico || '-',
				mark: atlasData.mark || '-',
				quality: atlasData.quality || '-',
				packaging_capacity: atlasData.packaging_type || '-',
				units: atlasData.units || '-',
				sample: atlasData.customer_cupping_state || '-',
				destinationPort: atlasData.destination_port || '-',
				price_type:
					atlasData.price_type === 'differential'
						? `${atlasData.price_type}: ${atlasData.fixed_price_status || 'Pending'}`
						: atlasData.price_type || '-',
				weight: atlasData.estimated_kg || '-',
				select: atlasData.ico,
				originPort: atlasData.origin_port,
			};
		});
	};

	const handleDestinationPortChange = (e) => {
		const value = Array.from(e.target.selectedOptions, (option) => option.value);
		setState((prevState) => ({ ...prevState, selectedDestinationPorts: value }));
	};
	const handleStartDateChange = (e) => {
		setState((prevState) => ({ ...prevState, startDate: e.target.value }));
	};

	const handleEndDateChange = (e) => {
		setState((prevState) => ({ ...prevState, endDate: e.target.value }));
	};
	const filteredTableData = () => {
		const { tableData, selectedDestinationPorts, startDate, endDate } = state;
		return tableData.filter((row) => {
			const shipmentDate = new Date(row.shipmentMonth);
			const start = startDate ? new Date(startDate) : null;
			const end = endDate ? new Date(endDate) : null;

			// Filtrar por puerto y rango de fechas
			return (
				(selectedDestinationPorts.length === 0 || selectedDestinationPorts.includes(row.destinationPort)) &&
				(!start || shipmentDate >= start) &&
				(!end || shipmentDate <= end)
			);
		});
	};

	const handleCheckboxChange = useCallback((ico) => {
		setState((prevState) => {
			const isSelected = prevState.selectedIcos.some((selected) => selected.ico === ico);

			// Buscar la información asociada al ico en contract_atlas
			const associatedData = prevState.filtersData.contract_atlas.find((atlas) => atlas.ico === ico);

			// Si está seleccionado, quitamos el objeto del estado; si no, lo añadimos con la información completa
			const updatedIcos = isSelected
				? prevState.selectedIcos.filter((selected) => selected.ico !== ico)
				: [...prevState.selectedIcos, associatedData];

			return { ...prevState, selectedIcos: updatedIcos };
		});
	}, []);

	if (state.loading) return <Loader />;

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('editContainer')}</h1>
				<h2 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('filters')}</h2>
				<div className='filtersContainers flex flex-row justify-between gap-6'>
					<InputGeneric
						type='select'
						filter='destinationPort'
						options={[...new Set(state.tableData.map((row) => row.destinationPort))]}
						onChange={handleDestinationPortChange}
						multiple={true}
						placeholder='Select destination ports'
						className='mb-6'
					/>

					<InputGeneric
						type='date'
						filter='startDate'
						onChange={handleStartDateChange}
						placeholder='Select start date'
						className='mb-6'
					/>
					<InputGeneric
						type='date'
						filter='endDate'
						onChange={handleEndDateChange}
						placeholder='Select end date'
						className='mb-6'
					/>
				</div>
				<h2 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('containerData')}</h2>
				<FiltersEditContainer filterValues={state.filtersData} selectedIcos={state.selectedIcos} oldExportId={id} />
				<TableGeneric
					headersTable={headersTableEditContainer}
					dataTable={filteredTableData().map((row) => ({
						...row,
						select: (
							<input
								type='checkbox'
								checked={state.selectedIcos.some((ico) => ico.ico === row.select)}
								onChange={() => handleCheckboxChange(row.select)}
							/>
						),
					}))}
				/>
			</section>
		</div>
	);
};
