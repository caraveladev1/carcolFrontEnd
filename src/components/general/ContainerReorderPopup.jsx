import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'containerCustomOrder';

export function ContainerReorderPopup({ 
	containers, 
	isOpen, 
	onClose, 
	onSave 
}) {
	const { t } = useTranslation();
	const [orderedContainers, setOrderedContainers] = useState([]);
	const [draggedItem, setDraggedItem] = useState(null);

	// Initialize containers with original order and custom order overlay
	useEffect(() => {
		if (!containers || containers.length === 0) return;

		// Get custom order from localStorage
		const savedOrder = localStorage.getItem(STORAGE_KEY);
		let customOrder = {};
		
		if (savedOrder) {
			try {
				customOrder = JSON.parse(savedOrder);
			} catch (error) {
				console.error('Error parsing saved container order:', error);
			}
		}

		// Sort containers by date_landing (most recent first) as base order
		// Include ALL containers, regardless of date
		const sortedByDate = [...containers].sort((a, b) => {
			const dateA = a.loading_to_port ? new Date(a.loading_to_port).getTime() : 0;
			const dateB = b.loading_to_port ? new Date(b.loading_to_port).getTime() : 0;
			return dateB - dateA; // Descending order (most recent first)
		});

		// Apply custom order if exists
		const finalOrder = [];
		const processedIds = new Set();

		// First, add containers in custom order if they exist
		if (customOrder.order && Array.isArray(customOrder.order)) {
			for (const expId of customOrder.order) {
				const container = sortedByDate.find(c => c.exp_id === expId);
				if (container) {
					finalOrder.push(container);
					processedIds.add(expId);
				}
			}
		}

		// Then, add any new containers that aren't in custom order (maintain date order)
		for (const container of sortedByDate) {
			if (!processedIds.has(container.exp_id)) {
				finalOrder.push(container);
			}
		}

		console.log(`📊 Total containers processed: ${finalOrder.length}`);
		console.log('📅 Date range:', {
			oldest: finalOrder.length > 0 ? finalOrder[finalOrder.length - 1]?.loading_to_port : 'none',
			newest: finalOrder.length > 0 ? finalOrder[0]?.loading_to_port : 'none'
		});

		setOrderedContainers(finalOrder);
	}, [containers]);

	const handleDragStart = (e, container) => {
		setDraggedItem(container);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = (e, targetContainer) => {
		e.preventDefault();
		
		if (!draggedItem || draggedItem.exp_id === targetContainer.exp_id) {
			setDraggedItem(null);
			return;
		}

		const draggedIndex = orderedContainers.findIndex(c => c.exp_id === draggedItem.exp_id);
		const targetIndex = orderedContainers.findIndex(c => c.exp_id === targetContainer.exp_id);

		if (draggedIndex === -1 || targetIndex === -1) return;

		const newOrder = [...orderedContainers];
		const [removed] = newOrder.splice(draggedIndex, 1);
		newOrder.splice(targetIndex, 0, removed);

		setOrderedContainers(newOrder);
		setDraggedItem(null);
	};

	const handleSave = () => {
		// Save the new order to localStorage
		const customOrder = {
			order: orderedContainers.map(c => c.exp_id),
			lastUpdated: new Date().toISOString()
		};

		localStorage.setItem(STORAGE_KEY, JSON.stringify(customOrder));
		
		// Call the onSave callback with the new order
		onSave(orderedContainers);
		onClose();
	};

	const handleResetOrder = () => {
		// Remove custom order from localStorage
		localStorage.removeItem(STORAGE_KEY);
		
		// Reset to original date order
		const sortedByDate = [...containers].sort((a, b) => {
			const dateA = a.loading_to_port ? new Date(a.loading_to_port).getTime() : 0;
			const dateB = b.loading_to_port ? new Date(b.loading_to_port).getTime() : 0;
			return dateB - dateA; // Descending order (most recent first)
		});
		
		setOrderedContainers(sortedByDate);
		
		// Call the onSave callback to trigger re-render in parent component
		onSave(sortedByDate);
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'No available';
		try {
			const date = new Date(dateString);
			// Check if date is valid
			if (isNaN(date.getTime())) return 'Invalid date';
			
			const today = new Date();
			const isPast = date < today;
			
			const formattedDate = date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
			
			// Add indicator for past dates
			return isPast ? `${formattedDate} (Past)` : formattedDate;
		} catch (error) {
			return 'Invalid date';
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
				{/* Header */}
				<div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
					<h2 className="text-xl font-bold">{t('reorderContainers')}</h2>
					<button
						onClick={onClose}
						className="text-gray-300 hover:text-white text-2xl"
					>
						×
					</button>
				</div>

				{/* Content */}
				<div className="p-6 max-h-96 overflow-y-auto">
					<div className="flex justify-between items-center mb-4">
						<p className="text-gray-600">
							Drag and drop containers to reorder them. The order will be saved and persisted.
						</p>
						<button
							onClick={handleResetOrder}
							className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-colors duration-200"
						>
							{t('resetOrder')}
						</button>
					</div>
					
					<div className="space-y-2">
						{orderedContainers.map((container, index) => {
							const isPastDate = container.loading_to_port && new Date(container.loading_to_port) < new Date();
							
							return (
								<div
									key={container.exp_id}
									draggable
									onDragStart={(e) => handleDragStart(e, container)}
									onDragOver={handleDragOver}
									onDrop={(e) => handleDrop(e, container)}
									className={`
										p-4 border rounded-lg cursor-move transition-all duration-200
										${draggedItem?.exp_id === container.exp_id 
											? 'opacity-50 scale-95' 
											: 'hover:shadow-md hover:border-blue-300'
										}
										${isPastDate ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}
									`}
								>
									<div className="flex justify-between items-center">
										<div className="flex items-center space-x-3">
											{/* Drag handle */}
											<div className="text-gray-400">
												<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
													<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
												</svg>
											</div>
											
											{/* Container info */}
											<div>
												<div className="font-semibold text-gray-800">
													{container.exp_id}
												</div>
												<div className={`text-sm ${isPastDate ? 'text-red-600' : 'text-gray-600'}`}>
													Loading to Port: {formatDate(container.loading_to_port)}
												</div>
											</div>
										</div>
										
										{/* Position indicator */}
										<div className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
											#{index + 1}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Footer */}
				<div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
					<button
						onClick={onClose}
						className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200"
					>
						{t('close')}
					</button>
					<button
						onClick={handleSave}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
					>
						{t('save')}
					</button>
				</div>
			</div>
		</div>
	);
}

// Hook to get custom container order
export const useCustomContainerOrder = () => {
	const getCustomOrder = () => {
		const savedOrder = localStorage.getItem(STORAGE_KEY);
		if (savedOrder) {
			try {
				return JSON.parse(savedOrder);
			} catch (error) {
				console.error('Error parsing saved container order:', error);
				return null;
			}
		}
		return null;
	};

	const applyCustomOrder = (containers) => {
		if (!containers || containers.length === 0) return containers;

		const customOrder = getCustomOrder();
		if (!customOrder || !customOrder.order) {
			// Return containers sorted by date_landing (most recent first)
			return Object.fromEntries(
				Object.entries(containers).sort(([, a], [, b]) => {
					const dateA = a.minDateLanding || 0;
					const dateB = b.minDateLanding || 0;
					return dateB - dateA; // Descending order
				})
			);
		}

		// Apply custom order
		const result = {};
		const processedIds = new Set();

		// First, add containers in custom order
		for (const expId of customOrder.order) {
			if (containers[expId]) {
				result[expId] = containers[expId];
				processedIds.add(expId);
			}
		}

		// Then, add any new containers that aren't in custom order (maintain date order)
		const remainingEntries = Object.entries(containers)
			.filter(([expId]) => !processedIds.has(expId))
			.sort(([, a], [, b]) => {
				const dateA = a.minDateLanding || 0;
				const dateB = b.minDateLanding || 0;
				return dateB - dateA; // Descending order
			});

		for (const [expId, data] of remainingEntries) {
			result[expId] = data;
		}

		return result;
	};

	return {
		getCustomOrder,
		applyCustomOrder
	};
};
