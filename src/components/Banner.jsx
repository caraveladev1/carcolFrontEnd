import React, { useState, useEffect, useRef } from 'react';
import logoCaravela from '../assets/img/logoCaravela.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useRole } from '../Hooks/RoleContext.js';
import { useAuth } from '../Hooks';
import { usePermissions } from '../Hooks/usePermissions';
import { PermissionGate } from './PermissionProtectedRoute';

export function Banner() {
	const { t } = useTranslation();
	const role = useRole();
	const { logout } = useAuth();
	const { hasPermission } = usePermissions();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef(null);
	const buttonRef = useRef(null);

	// Cerrar menú al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				isMenuOpen &&
				menuRef.current &&
				!menuRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};
	return (
		<section className='bannerSection w-full m-auto relative'>
			<div className='flex flex-row items-center justify-between py-2 gap-6 font-itf'>
				<div>
					<Link to='/'>
					<img className='cursor-pointer max-w-[50%]' src={logoCaravela} alt='Logo de caravela' />
					</Link>
				</div>

				{/* Botón de hamburguesa */}
				<div className='relative'>
					<button
						ref={buttonRef}
						onClick={toggleMenu}
						className='flex flex-col justify-center items-center w-8 h-8 bg-transparent cursor-pointer'
						aria-label='Menu'
					>
						<span
							className={`block h-0.5 w-6 bg-beige transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
						></span>
						<span
							className={`block h-0.5 w-6 bg-beige transition-all duration-300 my-1 ${isMenuOpen ? 'opacity-0' : ''}`}
						></span>
						<span
							className={`block h-0.5 w-6 bg-beige transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
						></span>
					</button>

					{/* Overlay oscuro */}
					{isMenuOpen && <div className='fixed inset-0 bg-black/50 z-40' onClick={closeMenu} />}

					{/* Barra lateral */}
					{isMenuOpen && (
						<div
							ref={menuRef}
							className={`fixed top-0 right-0 h-full w-80 bg-black border-l border-beige/20 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
								isMenuOpen ? 'translate-x-0' : 'translate-x-full'
							}`}
						>
							{/* Header de la barra lateral */}
							<div className='flex items-center justify-between p-6 border-b border-beige/20'>
								<h2 className='text-beige text-xl font-bold uppercase'>{t('menu')}</h2>
								<button onClick={closeMenu} className='text-beige hover:text-white transition-colors'>
									<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
									</svg>
								</button>
							</div>

							{/* Contenido del menú */}
							<div className='flex flex-col' style={{ height: 'calc(100vh - 73px)' }}>
												

								<div className='flex-1 py-6 overflow-y-auto'>
									<h3 className='text-beige/70 text-sm uppercase font-bold px-6 mb-3'>Contenedores</h3>
									
									<div className='mb-6'>
										<PermissionGate permission="tasks.view">
											<Link to='/pending-task' onClick={closeMenu}>
												<button className='w-full text-left px-6 py-4 text-celeste hover:bg-beige/10 uppercase font-bold transition-colors border-l-4 border-transparent hover:border-celeste'>
													{t('pendingTasks')}
												</button>
											</Link>
										</PermissionGate>
										
										<PermissionGate permission="containers.create">
											<Link to='/create' onClick={closeMenu}>
												<button className='w-full text-left px-6 py-4 text-pink hover:bg-beige/10 uppercase font-bold transition-colors border-l-4 border-transparent hover:border-pink'>
													{t('createContainers')}
												</button>
											</Link>
										</PermissionGate>
										
										<PermissionGate permission="containers.view">
											<Link to='/announcements' onClick={closeMenu}>
												<button className='w-full text-left px-6 py-4 text-naranja hover:bg-beige/10 uppercase font-bold transition-colors border-l-4 border-transparent hover:border-naranja'>
													{t('addAnnouncements')}
												</button>
											</Link>
										</PermissionGate>
										
										<PermissionGate permission="containers.view">
											<Link to='/view-containers' onClick={closeMenu}>
												<button className='w-full text-left px-6 py-4 text-yellow hover:bg-beige/10 uppercase font-bold transition-colors border-l-4 border-transparent hover:border-yellow'>
													{t('viewContainers')}
												</button>
											</Link>
										</PermissionGate>
										
										<PermissionGate permission="containers.view">
											<Link to='/exported-containers' onClick={closeMenu}>
												<button className='w-full text-left px-6 py-4 text-beige hover:bg-beige/10 uppercase font-bold transition-colors border-l-4 border-transparent hover:border-beige'>
													{t('exportedContainers')}
												</button>
											</Link>
										</PermissionGate>
									</div>

									{/* Botón para gestión de usuarios (solo si tiene permisos) */}
									{hasPermission('users.view') && (
										<div className='mb-6'>
											<h3 className='text-beige/70 text-sm uppercase font-bold px-6 mb-3'>Usuarios</h3>
											<Link to='/admin/manage-users' onClick={closeMenu}>
												<button className='w-full text-left px-6 py-4 text-pink hover:bg-beige/10 uppercase font-bold transition-colors border-l-4 border-transparent hover:border-pink'>
													{t('manageUsers')}
												</button>
											</Link>
										</div>
									)}
								</div>

								{/* Botón de logout al final - siempre visible */}
								<div className='flex-shrink-0 border-t border-beige/20 p-6 bg-black'>
									<button
										className='w-full text-center px-6 py-4 text-cafe bg-beige hover:bg-beige/80 uppercase font-bold transition-colors '
										onClick={() => {
											logout();
											closeMenu();
										}}
									>
										{t('logout')}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
