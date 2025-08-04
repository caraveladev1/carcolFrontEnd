import { useState, useEffect } from 'react';

const STORAGE_KEY = 'containerCustomOrder';

export const useContainerReorder = (containers) => {
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

		// Sort containers by date_landing (oldest first) as base order
		// Include ALL containers, regardless of date
		const sortedByDate = [...containers].sort((a, b) => {
			const dateA = a.loading_to_port ? new Date(a.loading_to_port).getTime() : Number.MAX_SAFE_INTEGER;
			const dateB = b.loading_to_port ? new Date(b.loading_to_port).getTime() : Number.MAX_SAFE_INTEGER;
			return dateA - dateB; // Ascending order (oldest first)
		});

		// Apply custom order if exists
		const finalOrder = [];
		const processedIds = new Set();

		// First, add containers in custom order if they exist
		if (customOrder.order && Array.isArray(customOrder.order)) {
			for (const expId of customOrder.order) {
				const container = sortedByDate.find((c) => c.exp_id === expId);
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

		const draggedIndex = orderedContainers.findIndex((c) => c.exp_id === draggedItem.exp_id);
		const targetIndex = orderedContainers.findIndex((c) => c.exp_id === targetContainer.exp_id);

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
			order: orderedContainers.map((c) => c.exp_id),
			lastUpdated: new Date().toISOString(),
		};

		localStorage.setItem(STORAGE_KEY, JSON.stringify(customOrder));

		// Return the ordered containers so the component can handle the callbacks
		return orderedContainers;
	};

	const handleResetOrder = () => {
		// Remove custom order from localStorage
		localStorage.removeItem(STORAGE_KEY);

		// Reset to original date order
		const sortedByDate = [...containers].sort((a, b) => {
			const dateA = a.loading_to_port ? new Date(a.loading_to_port).getTime() : Number.MAX_SAFE_INTEGER;
			const dateB = b.loading_to_port ? new Date(b.loading_to_port).getTime() : Number.MAX_SAFE_INTEGER;
			return dateA - dateB; // Ascending order (oldest first)
		});

		setOrderedContainers(sortedByDate);

		// Return the sorted containers so the component can handle the callback
		return sortedByDate;
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'No available';
		try {
			const date = new Date(dateString);
			// Check if date is valid
			if (isNaN(date.getTime())) return 'Invalid date';

			const today = new Date();
			today.setHours(0, 0, 0, 0); // Reset time to compare only dates
			date.setHours(0, 0, 0, 0);

			const isPast = date < today;

			const formattedDate = date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});

			// Add indicator for past dates
			return isPast ? `${formattedDate} (Overdue)` : formattedDate;
		} catch (error) {
			return 'Invalid date';
		}
	};

	return {
		orderedContainers,
		draggedItem,
		handleDragStart,
		handleDragOver,
		handleDrop,
		handleSave,
		handleResetOrder,
		formatDate,
	};
};

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
			// Return containers sorted by date_landing (oldest first)
			return Object.fromEntries(
				Object.entries(containers).sort(([, a], [, b]) => {
					const dateA = a.minDateLanding || Number.MAX_SAFE_INTEGER;
					const dateB = b.minDateLanding || Number.MAX_SAFE_INTEGER;
					return dateA - dateB; // Ascending order (oldest first)
				}),
			);
		}

		// Get all container entries and sort by date first
		const allEntries = Object.entries(containers).sort(([, a], [, b]) => {
			const dateA = a.minDateLanding || Number.MAX_SAFE_INTEGER;
			const dateB = b.minDateLanding || Number.MAX_SAFE_INTEGER;
			return dateA - dateB; // Ascending order (oldest first)
		});

		// Separate containers that are in custom order vs new ones
		const customOrderedIds = new Set(customOrder.order);
		const newContainers = allEntries.filter(([expId]) => !customOrderedIds.has(expId));
		const existingContainers = allEntries.filter(([expId]) => customOrderedIds.has(expId));

		// Create the final result
		const result = {};

		// For existing containers in custom order, maintain their custom position
		// but insert new containers in their chronological position
		let newContainerIndex = 0;

		for (const expId of customOrder.order) {
			if (containers[expId]) {
				// Before adding this custom-ordered container,
				// check if any new containers should go before it based on date
				const currentContainerDate = containers[expId].minDateLanding || Number.MAX_SAFE_INTEGER;

				while (newContainerIndex < newContainers.length) {
					const [newExpId, newData] = newContainers[newContainerIndex];
					const newContainerDate = newData.minDateLanding || Number.MAX_SAFE_INTEGER;

					if (newContainerDate <= currentContainerDate) {
						result[newExpId] = newData;
						newContainerIndex++;
					} else {
						break;
					}
				}

				// Add the custom-ordered container
				result[expId] = containers[expId];
			}
		}

		// Add any remaining new containers at the end
		while (newContainerIndex < newContainers.length) {
			const [newExpId, newData] = newContainers[newContainerIndex];
			result[newExpId] = newData;
			newContainerIndex++;
		}

		return result;
	};

	return {
		getCustomOrder,
		applyCustomOrder,
	};
};
