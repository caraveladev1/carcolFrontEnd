// Convierte un string tipo snake_case o camelCase a un formato legible para headers de tabla.
// Ejemplo: 'secondary_ico_id' => 'Secondary Ico Id', 'shipmentMonth' => 'Shipment Month'
export function formatHeader(header) {
	if (!header) return '';
	// Reemplaza puntos por espacios (para casos como 'role.name')
	let formatted = header.replace(/\./g, ' ');
	// Convierte snake_case a espacios
	formatted = formatted.replace(/_/g, ' ');
	// Convierte camelCase a espacios
	formatted = formatted.replace(/([a-z])([A-Z])/g, '$1 $2');
	// Capitaliza cada palabra
	formatted = formatted.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	return formatted;
}
