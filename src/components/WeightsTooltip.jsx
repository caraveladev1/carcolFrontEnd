import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatThousands } from '../utils/formatHeader';

export function WeightsTooltip({ isVisible, weightsData, position = 'top', onClose }) {
	const { t } = useTranslation();
	const tooltipRef = useRef(null);
	const [tooltipPosition, setTooltipPosition] = useState({
		vertical: position,
		horizontal: 'center',
		adjustedStyles: {}
	});

	useEffect(() => {
		if (!isVisible || !tooltipRef.current || !weightsData) return;

		const tooltip = tooltipRef.current;
		const parent = tooltip.parentElement;
		if (!parent) return;

		const handleClickOutside = (event) => {
			if (tooltip && !tooltip.contains(event.target) && !parent.contains(event.target)) {
				onClose?.();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		const tooltipRect = tooltip.getBoundingClientRect();
		const parentRect = parent.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		
		let newPosition = {
			vertical: position,
			horizontal: 'center',
			adjustedStyles: {}
		};

		// Calculate available space in all directions
		const spaceAbove = parentRect.top;
		const spaceBelow = viewportHeight - parentRect.bottom;

		// Determine best vertical position
		const tooltipHeight = tooltipRect.height || 350; // fallback height
		if (position === 'top' && spaceAbove < tooltipHeight + 20) {
			// Not enough space above, check if there's more space below
			if (spaceBelow > spaceAbove) {
				newPosition.vertical = 'bottom';
			}
		} else if (position === 'bottom' && spaceBelow < tooltipHeight + 20) {
			// Not enough space below, check if there's more space above
			if (spaceAbove > spaceBelow) {
				newPosition.vertical = 'top';
			}
		}

		// Determine best horizontal position
		const tooltipWidth = tooltipRect.width || 400; // fallback width
		const parentCenterX = parentRect.left + parentRect.width / 2;
		const tooltipHalfWidth = tooltipWidth / 2;

		// Calculate absolute positioning
		let top, left;

		// Vertical positioning with fixed positioning
		if (newPosition.vertical === 'top') {
			top = parentRect.top - tooltipHeight - 10; // 10px gap
			// Ensure it doesn't go above viewport
			if (top < 10) {
				top = parentRect.bottom + 10; // Show below instead
				newPosition.vertical = 'bottom';
			}
		} else {
			top = parentRect.bottom + 10; // 10px gap
			// Ensure it doesn't go below viewport
			if (top + tooltipHeight > viewportHeight - 10) {
				top = parentRect.top - tooltipHeight - 10; // Show above instead
				newPosition.vertical = 'top';
			}
		}

		// Horizontal positioning
		if (parentCenterX - tooltipHalfWidth < 20) {
			// Tooltip would overflow left, align to left
			newPosition.horizontal = 'left';
			left = 20; // 20px from left edge
		} else if (parentCenterX + tooltipHalfWidth > viewportWidth - 20) {
			// Tooltip would overflow right, align to right
			newPosition.horizontal = 'right';
			left = viewportWidth - tooltipWidth - 20; // 20px from right edge
		} else {
			// Center is fine
			newPosition.horizontal = 'center';
			left = parentCenterX - tooltipHalfWidth;
		}

		// Set absolute positioning
		newPosition.adjustedStyles = {
			position: 'fixed',
			top: `${Math.max(10, Math.min(top, viewportHeight - tooltipHeight - 10))}px`,
			left: `${Math.max(10, Math.min(left, viewportWidth - tooltipWidth - 10))}px`,
			transform: 'none'
		};

		setTooltipPosition(newPosition);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isVisible, position, weightsData, onClose]);
	
	if (!isVisible || !weightsData) return null;

	const { packagingBreakdown, totalBags, total60kgBags, totalUnits, totalWeight, totalPendingWeightsToMill, weightsInProgress, weightsFinished } = weightsData;

	const getTooltipClasses = () => {
		const baseClasses = "fixed z-50 bg-cafe text-beige p-4 shadow-lg border border-pink min-w-[350px] max-w-[450px]";
		
		let arrowClasses = "";

		// Arrow positioning based on vertical and horizontal alignment
		if (tooltipPosition.vertical === 'top') {
			arrowClasses = " before:content-[''] before:absolute before:w-0 before:h-0 before:top-full before:border-l-[8px] before:border-r-[8px] before:border-t-[8px] before:border-l-transparent before:border-r-transparent before:border-t-cafe";
		} else {
			arrowClasses = " before:content-[''] before:absolute before:w-0 before:h-0 before:bottom-full before:border-l-[8px] before:border-r-[8px] before:border-b-[8px] before:border-l-transparent before:border-r-transparent before:border-b-cafe";
		}

		// Arrow horizontal positioning
		if (tooltipPosition.horizontal === 'center') {
			arrowClasses += " before:left-1/2 before:-translate-x-1/2";
		} else if (tooltipPosition.horizontal === 'left') {
			arrowClasses += " before:left-6"; // Arrow positioned near left edge
		} else if (tooltipPosition.horizontal === 'right') {
			arrowClasses += " before:right-6"; // Arrow positioned near right edge
		}

		return baseClasses + arrowClasses;
	};

	return (
		<div 
			ref={tooltipRef}
			className={getTooltipClasses()}
			style={tooltipPosition.adjustedStyles}
		>
			<h3 className="text-lg font-bold font-itf mb-3 text-center border-b border-pink pb-2">
				{t('weightDetails')} </h3>
			
			{/* Packaging breakdown */}
			<div className="space-y-2 mb-4">
				{packagingBreakdown.map((item, index) => (
					<div key={index} className="flex justify-between items-center">
						<span className="font-itf text-sm text-beige">{item.packaging}:</span>
						<span className="font-itf font-bold text-beige">{formatThousands(item.units)} units</span>
					</div>
				))}
			</div>

			{/* Milling states section */}
			<div className="border-t border-beige pt-3 mb-3 space-y-2">
				<div className="flex justify-between items-center">
					<span className="font-itf text-sm text-beige">{t('totalPendingWeightsToMill')}:</span>
					<span className="font-itf font-bold text-orange-400">{formatThousands(totalPendingWeightsToMill)} {t('kg')}</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-itf text-sm text-beige">{t('weightsInProgress')}:</span>
					<span className="font-itf font-bold text-yellow-400">{formatThousands(weightsInProgress)} {t('kg')}</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-itf text-sm text-beige">{t('weightsFinished')}:</span>
					<span className="font-itf font-bold text-green-400">{formatThousands(weightsFinished)} {t('kg')}</span>
				</div>
			</div>

			{/* Totals section - without separator between them */}
			<div className="border-t border-beige pt-3 space-y-2">
				{/* Total units */}
				<div className="flex justify-between items-center">
					<span className="font-itf text-sm text-beige">{t('totalUnits')}:</span>
					<span className="font-itf font-bold text-beige">{formatThousands(totalUnits)} units</span>
				</div>
				
				{/* Total 60kg bags */}
				<div className="flex justify-between items-center">
					<span className="font-itf text-sm text-beige">{t('totalWeight60kgBags')}:</span>
					<span className="font-itf font-bold text-beige">{formatThousands(total60kgBags)}</span>
				</div>
				
				{/* Total weight - no border separator */}
				<div className="flex justify-between items-center">
					<span className="font-itf text-sm text-beige">{t('totalWeight')}:</span>
					<span className="font-itf font-bold text-beige">{formatThousands(totalWeight)} {t('kg')}</span>
				</div>
			</div>
		</div>
	);
}
