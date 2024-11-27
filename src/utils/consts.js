//export const API_BASE_URL = 'https://bckcarcol-e4h2fag7bke3gvd6.eastus2-01.azurewebsites.net/';
export const API_BASE_URL = 'http://localhost:8080/';
// Constantes de filtros
export const placeholderFilter = ['office', 'exportMonth', 'packaging', 'contract', 'destinationPort'];

// Encabezados de tabla Home (pendings)
export const headersTablePending = [
	'contract',
	'shipmentMonth',
	'ico',
	'secondary_ico_id',
	'mark',
	'quality',
	'packaging',
	'customer',
	'units',
	'destinationPort',
	'sample',
	'incoterm',
	'price_type',
	'weight',
];
export const headersTableView = [
	'contract',
	'shipmentMonth',
	'ico',
	'secondary_ico_id',
	'mark',
	'quality',
	'packaging',
	'customer',
	'units',
	'destinationPort',
	'sample',
	'incoterm',
	'price_type',
	'weight',
	'comments',
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
	'contract',
	'customer',
	'mark',
	'packaging_capacity',
	'quality',
	'units',
	'sample',
	'shipmentMonth',
	'destinationPort',
	'price_type',
	'weight',
	'select',
];

export const labelsBoogkindAndDates = [
	'booking',
	'dateLandingPort',
	'estimatedArrival',
	/* 'announcement',
	'estimatedDelivery',
	'order',
	'review',
	'salesCode', */
	'exportDate',
];

export const containerCapacity = {
	20: 20000.41,
	40: 26308.34,
};

export const viewContainerFilters = ['office', 'initialDate', 'finalDate', 'packaging', 'contract', 'destination'];

export const filtersEditContainer = [
	'booking',
	'dateLandingPort',
	'capacityContainer',
	'estimatedArrival',
	'exportDate',
	'port',
	'incoterm',
	'icosDestination',
	'exportId',
	'ico',
];

export const headersTableEditContainer = [
	'shipmentMonth',
	'ico_id',
	'secondary_ico_id',
	'mark',
	'quality',
	'packaging_capacity',
	'units',
	'sample',
	'destinationPort',
	'price_type',
	'weight',
	'select',
];
