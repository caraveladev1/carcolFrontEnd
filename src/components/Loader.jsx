import React from 'react';
import logoCaravela from '../assets/img/logoCaravela.png';

export function Loader() {
	return (
		<div className='loader w-full h-screen bg-verdeTexto'>
			<div className='flex flex-col justify-center m-auto items-center h-full'>
				<img src={logoCaravela} className='max-w-[15%] my-6' alt='Logo Caravela' />
				<h1 className='text-3xl font-itf text-celeste'>Loading...</h1>
			</div>
		</div>
	);
}
