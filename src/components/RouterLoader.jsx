import React from 'react';
import { Loader } from './Loader';

export function RouterLoader() {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='text-center'>
				<Loader />
				<p className='mt-4 text-gray-600'>Cargando...</p>
			</div>
		</div>
	);
}
