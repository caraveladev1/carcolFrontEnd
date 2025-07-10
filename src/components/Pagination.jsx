import React from 'react';

export function Pagination({ currentPage, totalItems, itemsPerPage = 100, onPageChange }) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	if (totalPages <= 1) return null;

	const getVisiblePages = () => {
		const maxVisible = 5;
		const pages = [];

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
			let end = Math.min(totalPages, start + maxVisible - 1);

			if (end - start + 1 < maxVisible) {
				start = Math.max(1, end - maxVisible + 1);
			}

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
		}

		return pages;
	};

	return (
		<div className='flex items-center justify-center gap-2 py-10'>
			<button
				onClick={() => onPageChange(1)}
				disabled={currentPage === 1}
				className='w-10 h-10 bg-pink text-cafe font-itf disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
			>
				«
			</button>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className='w-10 h-10 bg-pink text-cafe font-itf disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
			>
				‹
			</button>

			{getVisiblePages().map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`w-10 h-10 font-itf flex items-center justify-center ${
						page === currentPage
							? 'bg-pink text-cafe'
							: 'bg-transparent border-2 border-pink text-pink hover:bg-pink hover:text-cafe'
					}`}
				>
					{page}
				</button>
			))}

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className='w-10 h-10 bg-pink text-cafe font-itf disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
			>
				›
			</button>
			<button
				onClick={() => onPageChange(totalPages)}
				disabled={currentPage === totalPages}
				className='w-10 h-10 bg-pink text-cafe font-itf disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
			>
				»
			</button>
		</div>
	);
}
