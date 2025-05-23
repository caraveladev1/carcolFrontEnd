export const API_BASE_URL = 'https://bckcarcol.caravela.coffee/';
//export const API_BASE_URL = 'http://localhost:8080/';
// Constantes de filtros
export const placeholderFilter = ['office', 'exportMonth', 'packaging', 'contract', 'destinationPort'];

// Encabezados de tabla Home (pendings)
export const headersTablePending = [
	'contract',
	'shipmentMonth',
	'originPort',
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
	'production_order',
	'milling_order',
	'milling_state',
	'weight',
];
export const headersTableExported = [
	'contract',
	'shipmentMonth',
	'originPort',
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
	'production_order',
	'milling_order',
	'milling_state',
	'weight',
];
export const headersTableView = [
	'contract',
	'shipmentMonth',
	'originPort',
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
	'production_order',
	'milling_order',
	'milling_state',
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
	'originPort',
];

export const headersTableCreateContainer = [
	'ico_id',
	'secondary_ico_id',
	'originPort',
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
	'production_order',
	'milling_order',
	'milling_state',
	'weight',
	'select',
];

export const labelsBoogkindAndDates = ['booking', 'dateLandingPort', 'estimatedArrival', 'exportDate'];

export const containerCapacity = {
	20: 20000.41,
	40: 26308.34,
};

export const viewContainerFilters = [
	'office',
	'initialDate',
	'finalDate',
	'packaging',
	'contract',
	'destination',
	'ico',
];

export const filtersEditContainer = [
	'booking',
	'dateLandingPort',
	'capacityContainer',
	'estimatedArrival',
	'port',
	'exportDate',
	'originPort',
	'exportId',
	'incoterm',
];

export const headersTableEditContainer = [
	'shipmentMonth',
	'originPort',
	'ico_id',
	'secondary_ico_id',
	'mark',
	'quality',
	'packaging_capacity',
	'units',
	'sample',
	'destinationPort',
	'price_type',
	'production_order',
	'milling_order',
	'milling_state',
	'weight',
	'select',
];
