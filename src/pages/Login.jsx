import React, { useState } from 'react';
import { API_BASE_URL } from '../utils/consts';
import { useNavigate } from 'react-router-dom';

export function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!username || !password) {
			setErrorMessage('Both username and password are required');
			return;
		}

		const loginData = { username, password };
		try {
			const response = await fetch(`${API_BASE_URL}api/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginData),
			});

			if (!response.ok) {
				const data = await response.json();
				setErrorMessage(data.message || 'Invalid credentials');
				return;
			}

			const data = await response.json();

			if (!data.token) {
				setErrorMessage('Token not provided. Please try again.');
				return;
			}

			// Guarda el token en el almacenamiento local
			localStorage.setItem('token', data.token);
			localStorage.setItem('role', data.role);
			localStorage.setItem('username', data.username);

			// Redirige a la ruta protegida
			navigate('/');
		} catch (error) {
			setErrorMessage('Server error');
		}
	};

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<h2 className='text-5xl font-bayard uppercase text-center py-10 pt-[10%] text-beige'>
				Welcome to Shipment Planning
			</h2>
			<div className='formContainer flex flex-col items-center m-auto justify-center'>
				<form onSubmit={handleSubmit}>
					<div className='inputsContainer flex flex-col items-center m-auto justify-center gap-4'>
						<input
							className='border-2 border-beige bg-transparent p-4 font-bayard text-beige text-3xl '
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder='Username'
							required
						/>
						<input
							className='border-2 border-beige bg-transparent p-4 font-bayard text-beige text-3xl '
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Password'
							required
						/>
						{errorMessage && <p className='text-2xl text-red-600 font-bayard uppercase'>{errorMessage}</p>}
						<button type='submit' className='uppercase font-bayard text-beige text-5xl'>
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
