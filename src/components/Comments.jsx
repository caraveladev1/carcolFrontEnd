import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from './TextInput';
import { useComments } from '../Hooks/useComments';
import { Popup } from './Popup';

export function Comments({ ico, onClose, onCommentAdded, readOnly = false }) {
	const { t } = useTranslation();
	const { comments, control, addComment, popup, closePopup } = useComments(ico, onCommentAdded);

	return (
		<>
			<div className='commentsContainer fixed inset-0 bg-black/50 flex justify-center items-center'>
				<div className='relative'>
					<button
						className='absolute -top-4 -right-4 bg-red-500 font-itf text-white text-lg w-8 h-8 flex items-center justify-center z-10'
						onClick={onClose}
					>
						X
					</button>
					<div className='popup w-[40vw] min-w-[300px] max-w-[90vw] bg-beige p-4 max-h-[50vh] overflow-y-auto overflow-x-hidden'>
						<div className='max-w-[50%]'>
							<h1 className='text-lg font-itf text-cafe mt-4'>{ico}</h1>
						</div>
						<ul className='mt-6'>
							{comments.map((comment, index) => (
								<li className='text-lg font-itf text-cafe border-cafe border-t-2 p-4 break-words' key={index}>
									<p>{comment.comentario}</p>
									<small className='block text-sm text-gray font-itf'>
										{comment.user} – {comment.date}
									</small>
								</li>
							))}
						</ul>
						{!readOnly && (
							<form onSubmit={addComment}>
								<div className='flex flex-row justify-end mt-4 gap-6'>
									<TextInput
										name='comment'
										control={control}
										placeholder={t('typeComment')}
										className='h-30 bg-transparent text-lg border-2 border-cafe font-itf p-5 w-full text-cafe focus:outline-none focus:border-cafe resize-none overflow-y-auto'
										as='textarea'
										caseSensitive={true}
									/>
									<button type='submit' className='bg-cafe font-itf text-lg text-white p-4 h-30'>
										{t('submit')}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
			<Popup
				isOpen={popup.isOpen}
				onClose={closePopup}
				title={t(popup.title)}
				message={t(popup.message)}
				type={popup.type}
			/>
		</>
	);
}
