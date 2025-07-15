import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export function FilterSidebar({ children, title = 'filters' }) {
	const { t } = useTranslation();
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filterRef = useRef(null);
	const buttonRef = useRef(null);

	// Cerrar filtros al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				isFilterOpen &&
				filterRef.current &&
				!filterRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setIsFilterOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isFilterOpen]);

	const toggleFilter = () => {
		setIsFilterOpen(!isFilterOpen);
	};

	const closeFilter = () => {
		setIsFilterOpen(false);
	};

	return (
		<>
			{/* Botón de filtros */}
			<div className='relative mb-6'>
				<button
					ref={buttonRef}
					onClick={toggleFilter}
					className='flex items-center gap-2 bg-beige text-cafe px-6 py-3 font-itf font-bold uppercase transition-colors hover:bg-beige/80'
				>
					<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707l-2 2A1 1 0 0110 21v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
					</svg>
					{t(title)}
				</button>

				{/* Overlay oscuro */}
				{isFilterOpen && (
					<div 
						className='fixed inset-0 bg-black/50 z-40'
						onClick={closeFilter}
					/>
				)}

				{/* Barra lateral de filtros */}
				{isFilterOpen && (
					<div
						ref={filterRef}
						className={`fixed top-0 left-0 h-full w-96 bg-black border-r border-beige/20 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
							isFilterOpen ? 'translate-x-0' : '-translate-x-full'
						}`}
					>
						{/* Header de la barra lateral */}
						<div className='flex items-center justify-between p-6 border-b border-beige/20'>
							<h2 className='text-beige text-xl font-bold uppercase'>{t(title)}</h2>
							<button
								onClick={closeFilter}
								className='text-beige hover:text-white transition-colors'
							>
								<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
								</svg>
							</button>
						</div>

						{/* Contenido de los filtros */}
						<div className='flex flex-col' style={{ height: 'calc(100vh - 73px)' }}>
							<div className='flex-1 p-6 overflow-y-auto'>
								<div className='space-y-4'>
									{children}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
