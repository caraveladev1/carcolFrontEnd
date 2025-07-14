import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

export const useComments = (ico, onCommentAdded) => {
	const [comments, setComments] = useState([]);
	const [commentId, setCommentId] = useState(null);
	const [user, setUser] = useState('');

	const { control, handleSubmit, reset } = useForm({
		defaultValues: { comment: '' },
	});

	useEffect(() => {
		fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_USERNAME_FROM_TOKEN}`, {
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((data) => {
				setUser(data.username);
			})
			.catch((err) => console.error('Error obteniendo el usuario:', err));
	}, []);

	useEffect(() => {
		fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_COMMENTS_BY_ICO}/${ico}`)
			.then((response) => response.json())
			.then((json) => {
				const parsedComments = json.map((item) => {
					const commentArray = JSON.parse(item.comment);
					return { id: item.id, ico: item.ico, comment: commentArray };
				});

				if (parsedComments.length > 0) {
					setCommentId(parsedComments[0].id);
					setComments(parsedComments.flatMap((item) => item.comment));
				}
			})
			.catch((error) => console.error('Error fetching comments:', error));
	}, [ico]);

	const addComment = handleSubmit((data) => {
		const newCommentObject = {
			comentario: data.comment,
			user: user,
			date: new Date().toLocaleString(),
		};

		reset();

		const postData = {
			id: commentId,
			ico: ico,
			comment: [...comments, newCommentObject],
		};

		fetch(`${API_BASE_URL}${API_ENDPOINTS.ADD_COMMENT}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postData),
		})
			.then((response) => response.json())
			.then(() => {
				setComments((prevComments) => [...prevComments, newCommentObject]);

				// Notificar al componente padre que se agregó un comentario
				if (onCommentAdded) {
					onCommentAdded(ico);
				}

				alert('Comment added successfully');
			})
			.catch((error) => {
				console.error('Error al agregar el comentario:', error);
				alert('Error al agregar el comentario');
			});
	});

	return {
		comments,
		control,
		addComment,
	};
};
