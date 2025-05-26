import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/consts';
import { InputGeneric } from './InputGeneric';
import { SubmitButton } from './SubmitButton';
import { useTranslation } from 'react-i18next';

export function Comments({ ico, onClose }) {
	const { t } = useTranslation();
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [commentId, setCommentId] = useState(null);
	const [user, setUser] = useState('');
	const date = new Date().toLocaleString();
	useEffect(() => {
		fetch(`${API_BASE_URL}api/exports/getUsernameFromToken`, {
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((data) => {
				console.log('Usuario:', data.username);
				setUser(data.username);
			})
			.catch((err) => console.error('Error obteniendo el usuario:', err));
	}, []);

	useEffect(() => {
		fetch(`${API_BASE_URL}api/exports/getCommentsByIco/${ico}`)
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

	const handleCommentSubmit = (e) => {
		e.preventDefault();

		// Crea el nuevo comentario
		const newCommentObject = {
			comentario: newComment,
			user: user,
			date: date,
		};

		// Limpia el input inmediatamente
		setNewComment('');

		// Crea el nuevo cuerpo para enviar
		const postData = {
			id: commentId,
			ico: ico,
			comment: [...comments, newCommentObject],
		};

		// Envía el nuevo comentario al servidor
		fetch(`${API_BASE_URL}api/exports/comment/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postData),
		})
			.then((response) => response.json())
			.then((data) => {
				// Actualiza el estado 'comments' con el nuevo comentario
				setComments((prevComments) => [...prevComments, newCommentObject]);
				alert('Comment added successfully');
			})
			.catch((error) => {
				console.error('Error al agregar el comentario:', error);
				alert('Error al agregar el comentario');
			});
	};

	return (
		<div className='commentsContainer fixed inset-0 bg-black/50 flex justify-center items-center'>
			<div className='popup w-[40%] bg-beige p-4 relative max-h-[50%] overflow-y-auto overflow-x-hidden'>
				<button
					className='absolute top-0 right-0 bg-red-500 font-bayard text-white text-xl px-4 py-3'
					onClick={onClose}
				>
					Close
				</button>
				<div className='max-w-[50%]'>
					<h1 className='text-2xl font-itf text-cafe mt-4'>{ico}</h1>
				</div>
				<ul className='mt-6'>
					{comments.map((comment, index) => (
						<li className='text-xl font-itf text-cafe border-cafe border-t-2 p-4 break-words' key={index}>
							<p>{comment.comentario}</p>
							<small className='block text-sm text-gray font-itf'>
								{comment.user} – {comment.date}
							</small>
						</li>
					))}
				</ul>
				<form onSubmit={handleCommentSubmit}>
					<div className='flex flex-row justify-end mt-4 gap-6'>
						<input
							type='text'
							value={newComment} // El valor siempre está sincronizado con el estado
							onChange={(e) => setNewComment(e.target.value)}
							placeholder={t('typeComment')}
							className={`bg-transparent font-bayard text-xl uppercase border-2 border-cafe p-5 w-full text-cafe focus:outline-none focus:border-2 focus:border-cafe m-auto h-full`}
						/>
						<button type='submit' className={`bg-cafe font-bayard text-2xl text-white p-4 h-full `}>
							{t('submit')}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
