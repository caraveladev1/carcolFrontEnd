export const FILTER_NAMES = {
  CREATE_CONTAINER: [
    'capacityContainer',
    'shipmentMonthStart',
    'exportCountry',
    'shipmentMonthFinal',
    'port',
    'incoterm',
    'originPort',
  ],
  VIEW_CONTAINER: [
    'office',
    'initialDate',
    'finalDate',
    'packaging',
    'contract',
    'destination',
    'ico',
  ],
  EDIT_CONTAINER: [
    'booking',
    'dateLandingPort',
    'capacityContainer',
    'estimatedArrival',
    'port',
    'exportDate',
    'originPort',
    'exportId',
    'incoterm',
  ]
};

export const CONTAINER_CAPACITY = {
  20: 20000.41,
  40: 26308.34,
};

export const BOOKING_AND_DATES_LABELS = [
  'booking',
  'dateLandingPort',
  'estimatedArrival',
  'exportDate'
];

export const PLACEHOLDER_FILTERS = ['office', 'exportMonth', 'packaging', 'contract', 'destinationPort'];

// Legacy exports for backward compatibility
export const placeholderFilter = PLACEHOLDER_FILTERS;

// Individual filter names for backward compatibility
export const nameFilters = FILTER_NAMES.CREATE_CONTAINER;
export const viewContainerFilters = FILTER_NAMES.VIEW_CONTAINER;
export const filtersEditContainer = FILTER_NAMES.EDIT_CONTAINER;

// Other constants for backward compatibility
export const containerCapacity = CONTAINER_CAPACITY;
export const labelsBoogkindAndDates = BOOKING_AND_DATES_LABELS;