import React from 'react';
import logoCaravela from '../assets/img/logoCaravela.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Banner() {
	const { t } = useTranslation();
	const role = localStorage.getItem('role'); // Obtiene el rol del localStorage

	return (
		<section className='bannerSection w-full m-auto '>
			<div className='flex flex-row items-center justify-between py-2 gap-6 font-bayard'>
				<div>
					<img className='cursor-pointer max-w-[50%]' src={logoCaravela} alt='Logo de caravela' />
				</div>
				<div className='flex gap-6'>
					{/* Mostrar todos los botones si el rol es "1" */}
					{role === '1' && (
						<>
							<Link to='/'>
								<button className='cursor-pointer text-3xl text-celeste uppercase'>{t('pendingTasks')}</button>
							</Link>
							<Link to='/create'>
								<button className='cursor-pointer text-3xl text-pink uppercase'>{t('createContainers')}</button>
							</Link>
						</>
					)}
					{/* Mostrar siempre estos botones, tanto para "1" como para "2" */}
					<Link to='/view-containers'>
						<button className='cursor-pointer text-3xl text-yellow uppercase'>{t('viewContainers')}</button>
					</Link>
					<Link to='/exported-containers'>
						<button className='cursor-pointer text-3xl text-beige uppercase'>{t('exportedContainers')}</button>
					</Link>
				</div>
			</div>
		</section>
	);
}
