import React from 'react';

export function FloatingScrollButton() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const scrollToBottom = () => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	};

	return (
		<div
			style={{
				position: 'fixed',
				left: '24px',
				bottom: '24px',
				zIndex: 1000,
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
			}}
		>
			<button
				onClick={scrollToTop}
				style={{
					background: '#f5f5f5',
					border: 'none',
					borderRadius: '0',
					width: '48px',
					height: '48px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '2rem',
					cursor: 'pointer',
				}}
				aria-label='Scroll to top'
			>
				↑
			</button>
			<button
				onClick={scrollToBottom}
				style={{
					background: '#f5f5f5',
					border: 'none',
					borderRadius: '0',
					width: '48px',
					height: '48px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '2rem',
					cursor: 'pointer',
				}}
				aria-label='Scroll to bottom'
			>
				↓
			</button>
		</div>
	);
}
