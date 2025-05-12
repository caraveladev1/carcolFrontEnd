import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/const';
import { Loading } from '../../components/general/Loading';

export function AuthSync() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${API_BASE_URL}api/microsoft/protected`, {
			method: 'GET',
			credentials: 'include',
		})
			.then(async (res) => {
				setLoading(false);
				if (res.ok) {
					navigate('/fixed/dashboard');
				} else {
					navigate('/login');
				}
			})
			.catch(() => {
				setLoading(false);
				navigate('/login');
			});
	}, []);

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-screen bg-verde'>
				<Loading />
			</div>
		);
	}

	return null;
}
