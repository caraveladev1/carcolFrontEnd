import React from 'react';
import { LabelGeneric } from '../components/LabelGeneric';
import { DataTable } from '../components/DataTable';
import { useTranslation } from 'react-i18next';
import { nameFilters } from '../utils/consts';
import { Banner } from '../components/Banner';
import { InputGeneric } from '../components/InputGeneric';
export function CreateContainer() {
	const { t } = useTranslation();
	return (
		<div className='bg-dark-background bg-cover bg-fixed'>
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<h1 className='text-5xl font-bold  uppercase text-pink font-bayard'>{t('createContainer')}</h1>
				<div className='grid grid-cols-4 gap-4'>
					{nameFilters.map((filter) => (
						<div key={filter} className='col-span-2 flex items-center gap-4'>
							<LabelGeneric htmlFor={filter} filter={filter} className='col-span-1' />
							<InputGeneric
								type={
									filter === 'port' || filter === 'export' || filter === 'ico' || filter === 'mark'
										? 'select'
										: filter === 'approvalDate' || filter === 'date'
											? 'date'
											: 'text'
								}
								filter={filter}
								className='col-span-3 p-2'
							/>
						</div>
					))}
					<div className='table'>{/* <DataTable /> */}</div>
				</div>
			</section>
		</div>
	);
}
