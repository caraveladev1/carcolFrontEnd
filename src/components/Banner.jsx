import React from 'react';
import logoCaravela from '../assets/img/logoCaravela.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Banner() {
	const { t } = useTranslation();

	return (
		<section className='bannerSection w-full m-auto '>
			<div className='flex flex-row items-center justify-between py-2 gap-6 font-bayard'>
				<div className=''>
					<img className='cursor-pointer max-w-[50%]' src={logoCaravela} alt='Logo de caravela' />
				</div>
				<div className=' flex gap-6'>
					<Link to='/'>
						<button className='cursor-pointer text-3xl text-celeste uppercase'>{t('pendingTasks')}</button>
					</Link>
					<Link to='/create'>
						<button className='cursor-pointer text-3xl text-pink uppercase'>{t('createContainers')}</button>
					</Link>
					<Link to='/view-containers'>
						<button className='cursor-pointer text-3xl text-yellow uppercase '>{t('viewContainers')}</button>
					</Link>
				</div>
			</div>
		</section>
	);
}
