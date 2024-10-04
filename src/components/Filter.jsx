import React from 'react';
import { useTranslation } from 'react-i18next';

export function Filter({ placeholder, options, type = 'select', onChange, className, value }) {
	const { t } = useTranslation();
	if (type === 'date') {
		return <input type='date' className={`${className} bg-transparent w-48 p-3`} onChange={onChange} />;
	}

	return (
		<select className={`${className} bg-transparent w-48 p-3`} onChange={onChange} value={value}>
			<option value=''>{`${t('selectOption')} ${placeholder}`}</option>
			{options.map((option, index) => (
				<option key={index} value={option}>
					{option}
				</option>
			))}
		</select>
	);
}
