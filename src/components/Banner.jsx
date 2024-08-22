import React from 'react';
import logoCaravela from '../assets/logoCaravela.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Banner() {
	const { t } = useTranslation();

	return (
		<section className='bannerSection'>
			<div className='flex flex-row border border-red-500 p-4'>
				<div className='flex-shrink-0'>
					<Link to='/'>
						<img className='cursor-pointer' src={logoCaravela} alt='Logo de caravela' />
					</Link>
				</div>
				<div className='flex flex-row gap-6 ml-auto'>
					<Link to='/create'>
						<button className='cursor-pointer'>{t('createContainers')}</button>
					</Link>
					<Link to='/view'>
						<button className='cursor-pointer'>{t('viewContainers')}</button>
					</Link>
				</div>
			</div>
		</section>
	);
}
