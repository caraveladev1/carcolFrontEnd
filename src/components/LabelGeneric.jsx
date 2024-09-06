import React from 'react';
import { useTranslation } from 'react-i18next';

export function LabelGeneric({ type, filter }) {
	const { t } = useTranslation();
	return (
		<label
			id={filter}
			name={filter}
			className='bg-transparent font-bayard uppercase text-xl border-2 border-pink p-4 w-full h-full text-pink focus:outline-none focus:border-2 focus:border-pink flex items-center justify-center '
		>
			{t(filter)}
		</label>
	);
}
