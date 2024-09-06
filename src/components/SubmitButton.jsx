import React from 'react';

export function SubmitButton({ color, typeButton, className }) {
	return (
		<button type={typeButton} className={`bg-${color} font-bayard text-2xl text-white p-4 ${className}`}>
			Submit
		</button>
	);
}
