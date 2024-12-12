import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Banner } from '../components/Banner';
import { Loader } from '../components/Loader';
import { TableGeneric } from '../components/TableGeneric';
import { FiltersEditContainer } from '../components/FiltersEditContainer';
import { useParams } from 'react-router-dom';
import { API_BASE_URL, headersTableEditContainer } from '../utils/consts';
import { InputGeneric } from '../components/InputGeneric'; // Asegúrate de importar InputGeneric

export function EditContainer() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { t } = useTranslation();

	// Estados
	const [loading, setLoading] = useState(true);
	const [tableData, setTableData] = useState([]);
	const [selectedIcos, setSelectedIcos] = useState([]);
	const [filtersData, setFiltersData] = useState([]);
	const [selectedDestinationPorts, setSelectedDestinationPorts] = useState([]); // Estado para los puertos de destino seleccionados

	// Llamada en el useEffect
	useEffect(() => {
		const fetchContainerData = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}api/exports/getEditContainerData/${id}`);
				if (!response.ok) {
					throw new Error('Failed to fetch container data');
				}
				const data = await response.json();

				const selectedIcosFromContainers = data.containers.map((container) => container.contract_atlas);
				const combinedData = [...data.containers, ...data.contract_atlas];
				setFiltersData(data);
				setTableData(formatTableData(combinedData, selectedIcosFromContainers));
				setSelectedIcos(selectedIcosFromContainers);
			} catch (error) {
				console.error('Error fetching container data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchContainerData();
	}, [id]);

	// Función para formatear los datos de la tabla
	const formatTableData = (data) => {
		return data.map((entry) => {
			const isContainer = !!entry.contract_atlas;
			const atlasData = isContainer ? entry.contract_atlas : entry;

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
						: atlasData.price_type === 'fixed'
							? atlasData.price_type
							: '-',
				weight: atlasData.estimated_kg || '-',
				select: atlasData.ico,
				originPort: atlasData.origin_port,
			};
		});
	};

	// Función para manejar cambios en el filtro de destinationPort
	const handleDestinationPortChange = (e) => {
		setSelectedDestinationPorts(e.target.value);
	};

	// Función para filtrar los datos de la tabla por destinationPort
	const filterTableData = () => {
		return tableData.filter(
			(row) => selectedDestinationPorts.length === 0 || selectedDestinationPorts.includes(row.destinationPort),
		);
	};

	// Manejo de selección de elementos
	const handleCheckboxChange = useCallback(
		(ico) => {
			setSelectedIcos((prevSelected) => {
				const isAlreadySelected = prevSelected.some((selected) => selected.ico === ico);
				return isAlreadySelected ? prevSelected.filter((selected) => selected.ico !== ico) : [...prevSelected, { ico }];
			});
		},
		[setSelectedIcos],
	);

	// Renderizado del componente
	if (loading) {
		return <Loader />;
	}

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('editContainer')}</h1>
				{/* Filtro de Destination Port */}
				<h2 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('filters')}</h2>
				<InputGeneric
					type='select'
					filter='destinationPort'
					options={[...new Set(tableData.map((row) => row.destinationPort))]} // Obtener valores únicos de destinationPort
					onChange={handleDestinationPortChange}
					multiple={true}
					placeholder='Select destination ports'
					className='mb-6'
				/>
				<h2 className='text-5xl font-bold uppercase text-pink font-bayard mb-6'>{t('containerData')}</h2>
				<FiltersEditContainer filterValues={filtersData} selectedIcos={selectedIcos} oldExportId={id} />
				{/* Tabla de contratos */}

				<TableGeneric
					headersTable={headersTableEditContainer}
					dataTable={filterTableData().map((row) => ({
						...row,
						select: (
							<input
								type='checkbox'
								checked={selectedIcos.some((ico) => ico.ico === row.select)}
								onChange={() => handleCheckboxChange(row.select)}
							/>
						),
					}))}
				/>
			</section>
		</div>
	);
}
