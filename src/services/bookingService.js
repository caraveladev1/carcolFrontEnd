import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';

export const bookingService = {
	async updateBookingAndDates(formData, exportNumber) {
		return apiService.request(API_ENDPOINTS.BOOKING_AND_DATES, {
			method: 'PUT',
			body: JSON.stringify({ ...formData, exportNumber }),
		});
	},

	async setContainerLoaded(exportNumber) {
		return apiService.request(API_ENDPOINTS.SET_LOADED, {
			method: 'PUT',
			body: JSON.stringify({ setLoaded: '1', exportNumber }),
		});
	},

	validateRelatedData(relatedData) {
		if (!relatedData || relatedData.length === 0) {
			throw new Error('No hay datos relacionados para validar.');
		}

		const invalidEntries = relatedData.filter((item) => {
			if (
				item.contract_atlas.customerCuppingState === 'Not Sent' ||
				item.contract_atlas.customerCuppingState === 'Sent' ||
				item.contract_atlas.customerCuppingState === 'Rejected' ||
				item.contract_atlas.milling_state !== 'closed'
			) {
				return true;
			}

			if (item.contract_atlas.price_type !== 'fixed' && item.contract_atlas.fixed_price_status !== 'fixed') {
				return true;
			}

			return false;
		});

		if (invalidEntries.length > 0) {
			throw new Error(
				'The sample, fixation or milling state are not valid for loading the container. Please check the data before proceeding.',
			);
		}

		return true;
	},
};