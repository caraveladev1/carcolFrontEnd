import React from 'react';

export function Filter({ placeholder, options }) {
	return (
		<select className='bg-transparent border-2 border-beige w-48 p-3'>
			<option className='bg-transparent' value={placeholder} disabled hidden>
				{placeholder}
				{options}
			</option>
		</select>
	);
}
