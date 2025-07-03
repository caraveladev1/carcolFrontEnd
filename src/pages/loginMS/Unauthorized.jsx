import React from 'react';
import { useAuth } from '../../hooks';

export function Unauthorized() {
	const { logout } = useAuth();
	return (
		<div className='unauthorize bg-beige bg-cover min-h-screen flex flex-row'>
			<div className='m-auto items-center border-2 border-cafe p-6'>
				<h1 className='text-3xl font-[itf] text-cafe'>Unauthorize</h1>
				<p className='text-xl font-[itf] text-cafe'>You are not authorize to access this page</p>
				<div className='flex flex-row items-center me-auto mt-4'>
					<button className='border-cafe border-2 m-auto p-4 text-xl font-[itf] text-cafe' onClick={logout}>
						{' '}
						Go Back
					</button>
				</div>
			</div>
		</div>
	);
}
