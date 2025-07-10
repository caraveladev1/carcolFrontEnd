import React from 'react';
import ms_icon from '../../assets/img/MS_icon.svg';
import caravela_logo from '../../assets/img/logoCaravela.webp';
import { useAuth } from '../../Hooks';

export function LoginMS() {
	const { checking, login } = useAuth();

	if (checking) return null;

	return (
		<div className='bg-verde bg-cover min-h-screen flex flex-col m-auto justify-center'>
			<div className='flex flex-col justify-center m-auto items-center gap-4'>
				<img className='max-w-[15%]' src={caravela_logo} alt='Caravela Logo' />
				<button
					className='p-4 border-2 text-lg font-[itf] text-naranja font-bold uppercase flex flex-row justify-center m-auto items-center gap-4 cursor-pointer'
					onClick={login}
				>
					<img src={ms_icon} alt='ms icon' />
					Login with Microsoft
				</button>
			</div>
		</div>
	);
}
