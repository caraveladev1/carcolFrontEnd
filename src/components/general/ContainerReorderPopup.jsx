import React from 'react';
import { useTranslation } from 'react-i18next';
import { useContainerReorder } from '../../Hooks/useContainerReorder';

export function ContainerReorderPopup({ containers, isOpen, onClose, onSave }) {
	const { t } = useTranslation();
	const {
		orderedContainers,
		draggedItem,
		handleDragStart,
		handleDragOver,
		handleDrop,
		handleSave,
		handleResetOrder,
		formatDate,
	} = useContainerReorder(containers);

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white  shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden'>
				{/* Header */}
				<div className='bg-naranja text-white px-6 py-4 flex justify-between items-center'>
					<h2 className='text-xl font-bold font-itf'>{t('reorderContainers')}</h2>
					<button onClick={onClose} className='text-white font-itf hover:text-white text-4xl'>
						×
					</button>
				</div>

				{/* Content */}
				<div className='p-6 max-h-96 overflow-y-auto'>
					<div className='flex justify-between items-center mb-4 gap-6'>
						<p className='text-cafe font-itf'>
							Containers are ordered by Loading to Port date (oldest first). Drag and drop to reorder them.
						</p>
						<button
							onClick={() => {
								const result = handleResetOrder();
								onSave(result);
							}}
							className='px-3 py-2 min-w-[15%]  bg-cafe font-itf hover:bg-beige hover:text-cafe text-beige text-sm  transition-colors duration-200'
						>
							{t('resetOrder')}
						</button>
					</div>

					<div className='space-y-2'>
						{orderedContainers.map((container, index) => {
							const today = new Date();
							today.setHours(0, 0, 0, 0);
							const containerDate = container.loading_to_port ? new Date(container.loading_to_port) : null;
							if (containerDate) containerDate.setHours(0, 0, 0, 0);
							const isPastDate = containerDate && containerDate < today;

							return (
								<div
									key={container.exp_id}
									draggable
									onDragStart={(e) => handleDragStart(e, container)}
									onDragOver={handleDragOver}
									onDrop={(e) => handleDrop(e, container)}
									className={`
										p-4 border  cursor-move transition-all duration-200
										${
											draggedItem?.exp_id === container.exp_id
												? 'opacity-50 scale-95'
												: 'hover:shadow-md hover:border-naranja'
										}
										${isPastDate ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}
									`}
								>
									<div className='flex justify-between items-center'>
										<div className='flex items-center space-x-3'>
											{/* Drag handle */}
											<div className='text-cafe'>
												<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
													<path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
												</svg>
											</div>

											{/* Container info */}
											<div>
												<div className='font-semibold text-cafe'>{container.exp_id}</div>
												<div className={`text-sm ${isPastDate ? 'text-red-600 font-medium' : 'text-white'}`}>
													Loading to Port: {formatDate(container.loading_to_port)}
												</div>
											</div>
										</div>

										{/* Position indicator */}
										<div className='text-sm text-cafe bg-gray-200 px-2 py-1 '>#{index + 1}</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Footer */}
				<div className='bg-gray-50 px-6 py-4 flex justify-end'>
					<button
						onClick={() => {
							const result = handleSave();
							onSave(result);
							onClose();
						}}
						className='px-4 py-3  font-itf bg-cafe text-beige hover:text-cafe  hover:bg-beige transition-colors duration-200'
					>
						{t('save')}
					</button>
				</div>
			</div>
		</div>
	);
}
