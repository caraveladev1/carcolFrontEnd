import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/consts';
import { InputGeneric } from './InputGeneric';
import { SubmitButton } from './SubmitButton';

export function Comments({ ico, onClose }) {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [commentId, setCommentId] = useState(null);

	useEffect(() => {
		fetch(`${API_BASE_URL}api/exports/comment/${ico}`)
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

		// Crear el nuevo comentario
		const newCommentObject = { comentario: newComment };

		// Actualizar el estado de los comentarios
		const updatedComments = [...comments, newCommentObject];

		// Actualizar los comentarios en el estado
		setComments(updatedComments);

		// Limpiar el campo de entrada
		setNewComment('');

		// Crear el objeto para enviar a la API
		const postData = {
			id: commentId,
			ico: ico,
			comment: updatedComments,
		};

		// Enviar el nuevo comentario al servidor
		fetch(`${API_BASE_URL}api/exports/comment/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postData),
		})
			.then((response) => response.json())
			.then((data) => {
				window.alert('Comment added successfully');
				window.location.reload();
			})
			.catch((error) => console.error('Error al agregar el comentario:', error));
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
							{comment.comentario}
						</li>
					))}
				</ul>
				<form onSubmit={handleCommentSubmit}>
					<div className='flex flex-row justify-end mt-4 gap-6'>
						<InputGeneric
							placeholder='Type your comment here'
							type='text'
							required='required'
							value={newComment} // El valor siempre está sincronizado con el estado
							onChange={(e) => setNewComment(e.target.value)} // Cuando cambia el input, actualiza el estado
						/>
						<SubmitButton buttonText='submit' className='bg-cafe' />
					</div>
				</form>
			</div>
		</div>
	);
}
