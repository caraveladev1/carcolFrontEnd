import React from 'react';

export function InputGeneric({ type, filter, valuesSelect }) {
	return (
		<>
			{type === 'select' ? (
				<select
					id={filter}
					name={filter}
					className='bg-transparent font-itf border-2 border-pink p-4 mt-4 w-full text-pink focus:outline-none focus:border-2 focus:border-pink '
				>
					<option value={valuesSelect} disabled hidden>
						{filter}
					</option>
				</select>
			) : (
				<input
					type={type || 'text'}
					id={filter}
					name={filter}
					className='bg-transparent font-itf border-2 border-pink p-4 mt-4 w-full text-pink focus:outline-none focus:border-2 focus:border-pink'
				/>
			)}
		</>
	);
}
