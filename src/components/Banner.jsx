import React from 'react';
import logoCaravela from '../assets/img/logoCaravela.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useRole } from '../Hooks/RoleContext.js';
import { useAuth } from '../Hooks';

export function Banner() {
	const { t } = useTranslation();
	const role = useRole();
	const { logout } = useAuth();
	return (
		<section className='bannerSection w-full m-auto '>
			<div className='flex flex-row items-center justify-between py-2 gap-6 font-itf'>
				<div>
					<img className='cursor-pointer max-w-[50%]' src={logoCaravela} alt='Logo de caravela' />
				</div>
				<div className='flex gap-6 items-center'>
					{/* Mostrar todos los botones si el rol es "1" */}
					{role === 'Admin' ? (
						<>
							<Link to='/pending-task'>
								<button className='cursor-pointer text-2xl text-celeste uppercase font-bold'>{t('pendingTasks')}</button>
							</Link>
							<Link to='/create'>
								<button className='cursor-pointer text-2xl text-pink uppercase font-bold'>{t('createContainers')}</button>
							</Link>
						</>
					) : null}
					{/* Mostrar siempre estos botones, tanto para "1" como para "2" */}
					<Link to='/view-containers'>
						<button className='cursor-pointer text-2xl text-yellow uppercase font-bold'>{t('viewContainers')}</button>
					</Link>
					<Link to='/exported-containers'>
						<button className='cursor-pointer text-2xl text-beige uppercase font-bold'>{t('exportedContainers')}</button>
					</Link>
					<button className='bg-beige px-4 py-1 text-2xl uppercase text-cafe cursor-pointer font-itf font-bold' onClick={logout}>
						{t('logout')}
					</button>
				</div>
			</div>
		</section>
	);
}
