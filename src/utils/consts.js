export const API_BASE_URL = 'https://bckcarcol-e4h2fag7bke3gvd6.eastus2-01.azurewebsites.net/';
// Constantes de filtros
export const placeholderFilter = ['office', 'exportMonth', 'packaging', 'contract', 'destination'];

// Encabezados de tabla Home (pendings)
export const headersTablePending = [
	'contract',
	'ico',
	'secondary_ico_id',
	'mark',
	'customer',
	'packaging',
	'units',
	'sample',
	'incoterm',
	'pricingConditions',
];
export const headersTableView = [
	'contract',
	'shipmentMonth',
	'ico',
	'secondary_ico_id',
	'mark',
	'customer',
	'packaging',
	'units',
	'sample',
	'incoterm',
	'pricingConditions',
];

export const nameFilters = [
	'capacityContainer',
	'shipmentMonthStart',
	'exportCountry',
	'shipmentMonthFinal',
	'port',
	'incoterm',
];

export const headersTableCreateContainer = [
	'ico_id',
	'secondary_ico_id',
	'mark',
	'packaging_capacity',
	'units',
	'sample',
	'shipmentMonth',
	'pricingConditions',
	'select',
];

export const labelsBoogkindAndDates = [
	'booking',
	'dateLandingPort',
	'estimatedDelivery',
	'estimatedArrival',
	'announcement',
	'order',
	'review',
	'salesCode',
	'exportDate',
];

export const containerCapacity = {
	20: 20000.41,
	40: 26308.34,
};

export const viewContainerFilters = ['office', 'shipmentMonth', 'finalDate', 'packaging', 'contract', 'destination'];

export const filtersEditContainer = [
	'booking',
	'dateLandingPort',
	'estimatedDelivery',
	'estimatedArrival',
	'announcement',
	'order',
	'review',
	'salesCode',
	'exportDate',
	'capacityContainer',
	'port',
	'incoterm',
	'ico',
	'exportId',
];

export const headersTableEditContainer = [
	'ico_id',
	'secondary_ico_id',
	'mark',
	'packaging_capacity',
	'units',
	'sample',
	'shipmentMonth',
	'pricingConditions',
	'select',
];
