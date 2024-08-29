import React from 'react';
import { useTranslation } from 'react-i18next';
export function LabelGeneric({ type, filter }) {
	const { t } = useTranslation();
	return (
		<>
			<label
				id={filter}
				name={filter}
				className='bg-transparent font-itf border-2 border-pink p-4 mt-4 w-full text-pink focus:outline-none focus:border-2 focus:border-pink'
			>
				{t(filter)}
			</label>
		</>
	);
}
