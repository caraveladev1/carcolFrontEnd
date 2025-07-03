import React from 'react';

export function Pagination({ currentPage, totalItems, itemsPerPage = 100, onPageChange }) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	if (totalPages <= 1) return null;

	const getVisiblePages = () => {
		const delta = 2;
		const range = [];
		const rangeWithDots = [];

		for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
			range.push(i);
		}

		if (currentPage - delta > 2) {
			rangeWithDots.push(1, '...');
		} else {
			rangeWithDots.push(1);
		}

		rangeWithDots.push(...range);

		if (currentPage + delta < totalPages - 1) {
			rangeWithDots.push('...', totalPages);
		} else {
			rangeWithDots.push(totalPages);
		}

		return rangeWithDots;
	};

	return (
		<div className='flex items-center justify-center gap-2 my-6'>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className='p-1.5 bg-pink text-white font-bayard disabled:opacity-50 disabled:cursor-not-allowed'
			>
				Previous
			</button>

			{getVisiblePages().map((page, index) => (
				<button
					key={index}
					onClick={() => typeof page === 'number' && onPageChange(page)}
					disabled={page === '...'}
					className={`p-1.5 font-bayard ${
						page === currentPage
							? 'bg-pink text-white'
							: page === '...'
								? 'cursor-default'
								: 'bg-transparent border-2 border-pink text-pink hover:bg-pink hover:text-white'
					}`}
				>
					{page}
				</button>
			))}

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className='p-1.5 bg-pink text-white font-bayard disabled:opacity-50 disabled:cursor-not-allowed'
			>
				Next
			</button>
		</div>
	);
}
