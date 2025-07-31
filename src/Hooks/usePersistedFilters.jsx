import React, { useEffect, useState } from 'react';

/**
 * Hook para manejar filtros persistentes en sessionStorage y URL.
 * @param {Object} options
 * @param {Object} options.defaultValues - Valores por defecto de los filtros.
 * @param {string} options.storageKey - Clave para sessionStorage.
 * @returns {Object} { filters, setFilters }
 */
export function usePersistedFilters({ defaultValues, storageKey }) {
	// Obtener los valores iniciales de los filtros desde la URL o localStorage
	function getInitialFilters() {
		const params = new URLSearchParams(window.location.search);
		const initial = { ...defaultValues };
		let found = false;
		for (const key of Object.keys(initial)) {
			const val = params.get(key);
			if (val !== null) {
				found = true;
				if (Array.isArray(initial[key])) {
					initial[key] = val ? val.split(',') : [];
				} else {
					initial[key] = val;
				}
			}
		}
		if (found) {
			localStorage.setItem(storageKey, JSON.stringify(initial));
			return initial;
		}
		const stored = localStorage.getItem(storageKey);
		if (stored) {
			return JSON.parse(stored);
		}
		return initial;
	}

	// Estado local de los filtros
	const [filters, setFilters] = useState(getInitialFilters());

	// Guardar los filtros en localStorage y URL como parámetros individuales
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(filters));
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(filters)) {
			if (Array.isArray(value) && value.length > 0) {
				params.set(key, value.join(','));
			} else if (typeof value === 'string' && value) {
				params.set(key, value);
			}
		}
		window.history.replaceState(
			{},
			'',
			`${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`,
		);
	}, [filters, storageKey]);

	return { filters, setFilters };
}
