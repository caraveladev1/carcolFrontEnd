import React from 'react';
import logoCaravela from '../assets/img/logoCaravela.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/consts';
import { useRole } from '../Hooks/RoleContext.js';

export function Banner() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const role = useRole(); // Obtiene el rol del localStorage
	const logout = () => {
		fetch(`${API_BASE_URL}api/microsoft/logout`, {
			method: 'POST',
			credentials: 'include',
		}).then(() => {
			navigate('/login');
		});
	};
	return (
		<section className='bannerSection w-full m-auto '>
			<div className='flex flex-row items-center justify-between py-2 gap-6 font-bayard'>
				<div>
					<img className='cursor-pointer max-w-[50%]' src={logoCaravela} alt='Logo de caravela' />
				</div>
				<div className='flex gap-6'>
					{/* Mostrar todos los botones si el rol es "1" */}
					{role === 'Admin' ? (
						<>
							<Link to='/pending-task'>
								<button className='cursor-pointer text-3xl text-celeste uppercase'>{t('pendingTasks')}</button>
							</Link>
							<Link to='/create'>
								<button className='cursor-pointer text-3xl text-pink uppercase'>{t('createContainers')}</button>
							</Link>
						</>
					) : null}
					{/* Mostrar siempre estos botones, tanto para "1" como para "2" */}
					<Link to='/view-containers'>
						<button className='cursor-pointer text-3xl text-yellow uppercase'>{t('viewContainers')}</button>
					</Link>
					<Link to='/exported-containers'>
						<button className='cursor-pointer text-3xl text-beige uppercase'>{t('exportedContainers')}</button>
					</Link>
					<button className='bg-beige px-4 text-3xl uppercase text-cafe cursor-pointer font-bayard' onClick={logout}>
						{t('logout')}
					</button>
				</div>
			</div>
		</section>
	);
}
