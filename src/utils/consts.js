// Import from new constants structure
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api.js';
import { TABLE_HEADERS } from '../constants/tableHeaders.js';
import { FILTER_NAMES, CONTAINER_CAPACITY, BOOKING_AND_DATES_LABELS } from '../constants/filters.js';

// Re-export for backward compatibility
export { API_BASE_URL, API_ENDPOINTS };

// Legacy exports for backward compatibility
export const placeholderFilter = ['office', 'exportMonth', 'packaging', 'contract', 'destinationPort'];

// Individual table headers for backward compatibility
export const headersTablePending = TABLE_HEADERS.PENDING;
export const headersTableExported = TABLE_HEADERS.EXPORTED;
export const headersTableView = TABLE_HEADERS.VIEW;
export const headersTableCreateContainer = TABLE_HEADERS.CREATE_CONTAINER;
export const headersTableEditContainer = TABLE_HEADERS.EDIT_CONTAINER;
export const headersTableManageUsers = TABLE_HEADERS.MANAGE_USERS;

// Individual filter names for backward compatibility
export const nameFilters = FILTER_NAMES.CREATE_CONTAINER;
export const viewContainerFilters = FILTER_NAMES.VIEW_CONTAINER;
export const filtersEditContainer = FILTER_NAMES.EDIT_CONTAINER;

// Other constants
export const containerCapacity = CONTAINER_CAPACITY;
export const labelsBoogkindAndDates = BOOKING_AND_DATES_LABELS;
