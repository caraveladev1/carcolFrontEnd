import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

export const useCommentNotifications = (user) => {
	const [unreadComments, setUnreadComments] = useState(new Set()); // Comentarios no leídos (verde)
	const [icosWithComments, setIcosWithComments] = useState(new Set()); // ICOs que tienen comentarios (rojo)
	const [loading, setLoading] = useState(false);

	// Obtener ICOs con comentarios no leídos al cargar
	useEffect(() => {
		if (user) {
			fetchUnreadComments();
			fetchIcosWithComments();
		}
	}, [user]);

	const fetchUnreadComments = async () => {
		try {
			setLoading(true);
			//console.log('🔄 Obteniendo comentarios no leídos para usuario:', user);

			const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_UNREAD_COMMENTS}`, {
				credentials: 'include',
			});

			if (response.ok) {
				const unreadIcos = await response.json();
				//console.log('📬 Comentarios no leídos recibidos:', unreadIcos);
				setUnreadComments(new Set(unreadIcos));
			} else {
				console.error('❌ Error al obtener comentarios no leídos:', response.status);
			}
		} catch (error) {
			console.error('❌ Error obteniendo comentarios no leídos:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchIcosWithComments = async () => {
		try {
			//console.log('🔄 Obteniendo ICOs con comentarios para usuario:', user);

			const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_ICOS_WITH_COMMENTS}`, {
				credentials: 'include',
			});

			if (response.ok) {
				const icosWithCommentsData = await response.json();
				//console.log('📋 ICOs con comentarios recibidos:', icosWithCommentsData);
				setIcosWithComments(new Set(icosWithCommentsData));
			} else {
				console.error('❌ Error al obtener ICOs con comentarios:', response.status);
			}
		} catch (error) {
			console.error('❌ Error obteniendo ICOs con comentarios:', error);
		}
	};

	const markAsRead = async (ico) => {
		try {
			//console.log('🔄 Marcando como leído:', ico);
			const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MARK_COMMENTS_AS_VIEWED}/${ico}`, {
				method: 'PUT',
				credentials: 'include',
			});

			//console.log('📡 Respuesta del servidor:', response.status, response.ok);

			if (response.ok) {
				const result = await response.json();
				//console.log('✅ Resultado:', result);

				setUnreadComments((prev) => {
					const newSet = new Set(prev);
					const wasRemoved = newSet.delete(ico);
					//console.log('🗑️ Removido de unread:', wasRemoved, 'ICO:', ico);
					//console.log('📋 Nuevos unread:', [...newSet]);
					return newSet;
				});
			} else {
				const errorData = await response.text();
				console.error('❌ Error del servidor:', errorData);
			}
		} catch (error) {
			console.error('❌ Error marcando comentarios como leídos:', error);
		}
	};

	const addUnreadComment = (ico) => {
		setUnreadComments((prev) => new Set([...prev, ico]));
		// También agregamos el ICO a la lista de ICOs con comentarios
		setIcosWithComments((prev) => new Set([...prev, ico]));
	};

	const hasUnreadComments = (ico) => {
		return unreadComments.has(ico);
	};

	const hasComments = (ico) => {
		return icosWithComments.has(ico);
	};

	const getNotificationStatus = (ico) => {
		if (!icosWithComments.has(ico)) {
			return 'none'; // Sin notificación
		}
		if (unreadComments.has(ico)) {
			return 'unread'; // Verde - comentarios no leídos
		}
		return 'read'; // Rojo - tiene comentarios pero todos están leídos
	};

	const refreshNotifications = () => {
		if (user) {
			fetchUnreadComments();
			fetchIcosWithComments();
		}
	};

	return {
		unreadComments,
		icosWithComments,
		markAsRead,
		addUnreadComment,
		hasUnreadComments,
		hasComments,
		getNotificationStatus,
		refreshNotifications,
		loading,
	};
};
