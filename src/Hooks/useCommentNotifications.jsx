import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/consts';

export const useCommentNotifications = (user) => {
	const [unreadComments, setUnreadComments] = useState(new Set());
	const [loading, setLoading] = useState(false);

	// Obtener ICOs con comentarios no leídos al cargar
	useEffect(() => {
		if (user) {
			fetchUnreadComments();
		}
	}, [user]);

	const fetchUnreadComments = async () => {
		try {
			setLoading(true);
			//console.log('🔄 Obteniendo comentarios no leídos para usuario:', user);

			const response = await fetch(`${API_BASE_URL}api/exports/comments/unread`, {
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

	const markAsRead = async (ico) => {
		try {
			console.log('🔄 Marcando como leído:', ico);
			const response = await fetch(`${API_BASE_URL}api/exports/comments/markAsViewed/${ico}`, {
				method: 'PUT',
				credentials: 'include',
			});

			console.log('📡 Respuesta del servidor:', response.status, response.ok);

			if (response.ok) {
				const result = await response.json();
				console.log('✅ Resultado:', result);

				setUnreadComments((prev) => {
					const newSet = new Set(prev);
					const wasRemoved = newSet.delete(ico);
					console.log('🗑️ Removido de unread:', wasRemoved, 'ICO:', ico);
					console.log('📋 Nuevos unread:', [...newSet]);
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
	};

	const hasUnreadComments = (ico) => {
		return unreadComments.has(ico);
	};

	const refreshNotifications = () => {
		if (user) {
			fetchUnreadComments();
		}
	};

	return {
		unreadComments,
		markAsRead,
		addUnreadComment,
		hasUnreadComments,
		refreshNotifications,
		loading,
	};
};
