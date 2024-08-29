import React from 'react';

export function SubmitButton({ color, typeButton }) {
	return (
		<button type={typeButton} className={`col-span-4 bg-${color} font-itf text-xl text-white p-4`}>
			Submit
		</button>
	);
}
