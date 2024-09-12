import React from 'react';

export function SubmitButton({ color, typeButton, className, onClick }) {
	return (
		<button
			type={typeButton}
			onClick={onClick}
			className={`bg-${color} font-bayard text-2xl text-white p-4 ${className}`}
		>
			Submit
		</button>
	);
}
