import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/consts';
import ms_icon from '../../assets/img/MS_icon.svg';
import caravela_logo from '../../assets/img/logoCaravela.webp';

export function LoginMS() {
	const navigate = useNavigate();
	const [checking, setChecking] = useState(true);
	useEffect(() => {
		// 1. Verifica si ya está logueado
		fetch(`${API_BASE_URL}api/microsoft/protected`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((res) => {
				if (res.ok) {
					navigate('/view-containers', { replace: true });
				}
			})
			.finally(() => {
				setChecking(false);
			});
	}, []);

	useEffect(() => {
		// 2. Procesa el code si existe
		if (!checking) {
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');
			if (code) {
				window.history.replaceState({}, document.title, window.location.pathname);
				window.location.href = `${API_BASE_URL}api/microsoft/redirect?code=${code}`;
			}
		}
	}, [checking]);

	const login = () => {
		window.location.href = `${API_BASE_URL}api/microsoft/login`;
	};

	if (checking) return null;

	return (
		<div className='bg-verde bg-cover min-h-screen flex flex-col m-auto justify-center'>
			<div className='flex flex-col justify-center m-auto items-center gap-4'>
				<img className='max-w-[15%]' src={caravela_logo} alt='Caravela Logo' />
				<button
					className='p-4 border-2 text-2xl font-[itf] text-naranja font-bold uppercase flex flex-row justify-center m-auto items-center gap-4 cursor-pointer'
					onClick={login}
				>
					<img src={ms_icon} alt='ms icon' />
					Login with Microsoft
				</button>
			</div>
		</div>
	);
}
