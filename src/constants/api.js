export const API_BASE_URL = 'https://bckcarcoltest.caravela.coffee/';
//export const API_BASE_URL = 'https://bckcarcol.caravela.coffee/';
//export const API_BASE_URL = 'http://localhost:8080/';

export const API_ENDPOINTS = {
	PENDING_CONTAINERS: 'api/exports/getPendingContainers',
	ALL_EXPORTS: 'api/exports/getAllExports',
	ALL_CONTAINERS: 'api/exports/getAllContainers',
	EXPORTED_CONTAINERS: 'api/exports/getExportedContainers',
	CREATE_CONTAINER: 'api/exports/createContainer',
	EDIT_CONTAINER_DATA: 'api/exports/getEditContainerData',
	MS_PROTECTED: 'api/microsoft/protected',
	MS_LOGIN: 'api/microsoft/login',
	MS_LOGOUT: 'api/microsoft/logout',
	MS_REDIRECT: 'api/microsoft/redirect',
	BOOKING_AND_DATES: 'api/exports/addBookingAndDates',
	SET_LOADED: 'api/exports/setLoaded',
	VALIDATE_TOKEN: 'api/auth/validate-token',
	// Comments endpoints
	GET_USERNAME_FROM_TOKEN: 'api/exports/getUsernameFromToken',
	GET_COMMENTS_BY_ICO: 'api/exports/getCommentsByIco',
	ADD_COMMENT: 'api/exports/comment/add',
	GET_UNREAD_COMMENTS: 'api/exports/comments/unread',
	MARK_COMMENTS_AS_VIEWED: 'api/exports/comments/markAsViewed',
	// User management endpoints
	USERS: 'api/users',
	USER_PERMISSIONS: 'api/users/permissions',
	USER_ROLES: 'api/users/roles',
};
