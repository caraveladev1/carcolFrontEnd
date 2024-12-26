import React, { useEffect, useState } from 'react';
import { InputGeneric } from './InputGeneric';
import { API_BASE_URL } from '../utils/consts';
import { useTranslation } from 'react-i18next';

export function Announcements({ onClose }) {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [formData, setFormData] = useState({});

	// Filtros
	const [dateRange, setDateRange] = useState({ start: '', end: '' });
	const [selectedPackaging, setSelectedPackaging] = useState([]);
	const [selectedOriginPorts, setSelectedOriginPorts] = useState([]);
	const [selectedIcos, setSelectedIcos] = useState([]);
	const [selectedLotTypes, setSelectedLotTypes] = useState([]);
	const { t } = useTranslation();

	// Manejar cambios en los campos de entrada
	const handleInputChange = (icoId, field, value) => {
		setFormData((prevData) => ({
			...prevData,
			[icoId]: {
				...prevData[icoId],
				[field]: value,
			},
		}));
	};

	// Cargar los datos al montar el componente
	useEffect(() => {
		fetch(`${API_BASE_URL}api/exports/getAnnouncements`)
			.then((response) => response.json())
			.then((data) => {
				setData(data);
				setFilteredData(data);

				// Inicializar formData con valores existentes o vacíos
				const initialFormData = {};
				data.forEach((item) => {
					initialFormData[item.ico] = {
						announcement: item.announcement || '',
						orders: item.orders || '',
						review: item.review || '',
						sales_code: item.sales_code || '',
						origin_port: item.origin_port || '',
						lot_type: item.lot_type || '',
					};
				});
				setFormData(initialFormData);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}, []);
	// Manejar el envío de datos al servidor
	const addAnnouncements = () => {
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
				onClose();
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	// Manejar el cambio en el rango de fechas
	const handleDateRangeChange = (field, value) => {
		setDateRange((prev) => ({ ...prev, [field]: value }));
	};

	// Filtrar los datos
	useEffect(() => {
		let filtered = [...data];

		// Filtro por rango de fechas
		if (dateRange.start || dateRange.end) {
			const start = dateRange.start ? new Date(dateRange.start) : null;
			const end = dateRange.end ? new Date(dateRange.end) : null;

			filtered = filtered.filter((item) => {
				const date = new Date(item.date_landing);
				return (!start || date >= start) && (!end || date <= end);
			});
		}

		// Filtro por packaging_capacity
		if (selectedPackaging.length > 0) {
			filtered = filtered.filter((item) => selectedPackaging.includes(item.packaging_capacity));
		}

		// Filtro por origin_port
		if (selectedOriginPorts.length > 0) {
			filtered = filtered.filter((item) => selectedOriginPorts.includes(item.origin_port));
		}

		// Filtro por ICOs
		if (selectedIcos.length > 0) {
			filtered = filtered.filter((item) => selectedIcos.includes(item.ico));
		}
		// Filtro por lot_type
		if (selectedLotTypes.length > 0) {
			filtered = filtered.filter((item) => selectedLotTypes.includes(item.lot_type));
		}

		setFilteredData(filtered);
	}, [dateRange, selectedPackaging, selectedOriginPorts, selectedIcos, selectedLotTypes, data]);

	return (
		<div className='announcementContainer fixed inset-0 bg-black/50 flex justify-center items-center'>
			<div className='popup w-[80%] overflow-auto max-h-[70%] bg-beige pt-12 px-4 relative'>
				<button className='absolute top-0 right-0 bg-red-500 text-white p-1' onClick={onClose}>
					<p className='font-bayard text-2xl px-4'>Close</p>
				</button>

				{/* Filtros */}
				<div className='filters grid grid-cols-6 gap-4 mb-4'>
					<div className='col-span-1'>
						<input
							type='date'
							value={dateRange.start}
							onChange={(e) => handleDateRangeChange('start', e.target.value)}
							className='bg-transparent font-bayard text-xl uppercase border-2 border-pink p-5 w-full text-pink focus:outline-none focus:border-2 focus:border-pink h-full'
						/>
					</div>
					<div className='col-span-1'>
						<input
							type='date'
							value={dateRange.end}
							onChange={(e) => handleDateRangeChange('end', e.target.value)}
							className='bg-transparent font-bayard text-xl uppercase border-2 border-pink p-5 w-full text-pink focus:outline-none focus:border-2 focus:border-pink h-full'
						/>
					</div>
					<div className='col-span-1'>
						<InputGeneric
							type='select'
							multiple={true}
							filter='packaging_capacity'
							options={[...new Set(data.map((item) => item.packaging_capacity))]} // Opciones únicas
							defaultValue={selectedPackaging}
							onChange={(e) => setSelectedPackaging(e.target.value)}
							placeholder='Select Packaging'
						/>
					</div>
					<div className='col-span-1'>
						<InputGeneric
							type='select'
							multiple={true}
							filter='origin_port'
							options={[...new Set(data.map((item) => item.origin_port))]} // Opciones únicas
							defaultValue={selectedOriginPorts}
							onChange={(e) => setSelectedOriginPorts(e.target.value)}
							placeholder='Select Origin Port'
						/>
					</div>
					<div className='col-span-1'>
						<InputGeneric
							type='select'
							multiple={true}
							filter='ico'
							options={[...new Set(data.map((item) => item.ico))]} // Opciones únicas
							defaultValue={selectedIcos}
							onChange={(e) => setSelectedIcos(e.target.value)}
							placeholder='Select ICOs'
						/>
					</div>
					<div className='col-span-1'>
						<InputGeneric
							type='select'
							multiple={true}
							filter='lot_type'
							options={[...new Set(data.map((item) => item.lot_type))]} // Opciones únicas
							defaultValue={selectedLotTypes}
							onChange={(e) => setSelectedLotTypes(e.target.value)}
							placeholder='Select Lot Type'
						/>
					</div>
				</div>

				{/* Lista de datos filtrados */}
				<div className='container space-y-4'>
					{filteredData.length > 0 ? (
						filteredData.map((item) => (
							<div key={item.ico} className='grid grid-cols-8 gap-4'>
								<p className='col-span-1 font-bayard text-2xl text-center m-auto text-pink'>{item.ico}</p>
								<p className='col-span-1 text-center'>{item.date_landing}</p>
								<p className='col-span-1 text-center'>{item.packaging_capacity}</p>
								<p className='col-span-1 text-center'>{item.lot_type}</p>
								<p className='col-span-1 text-center'>{item.origin_port}</p>
								<div className='col-span-1'>
									<InputGeneric
										placeholder='Announcement'
										defaultValue={formData[item.ico]?.announcement}
										onChange={(e) => handleInputChange(item.ico, 'announcement', e.target.value)}
									/>
								</div>
								<div className='col-span-1'>
									<InputGeneric
										placeholder='Order'
										defaultValue={formData[item.ico]?.orders}
										onChange={(e) => handleInputChange(item.ico, 'orders', e.target.value)}
									/>
								</div>
								<div className='col-span-1'>
									<InputGeneric
										placeholder='Review'
										defaultValue={formData[item.ico]?.review}
										onChange={(e) => handleInputChange(item.ico, 'review', e.target.value)}
									/>
								</div>
							</div>
						))
					) : (
						<p>No items to display.</p>
					)}
				</div>

				<div className='flex justify-end'>
					<button className='bg-verde text-white p-1 my-4' onClick={addAnnouncements}>
						<p className='font-bayard text-2xl px-4'>Submit</p>
					</button>
				</div>
			</div>
		</div>
	);
}
