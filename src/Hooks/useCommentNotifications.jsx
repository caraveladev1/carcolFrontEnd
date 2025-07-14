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
            const response = await fetch(`${API_BASE_URL}api/exports/comments/unread`, {
                credentials: 'include',
            });
            
            if (response.ok) {
                const unreadIcos = await response.json();
                setUnreadComments(new Set(unreadIcos));
            }
        } catch (error) {
            console.error('Error obteniendo comentarios no leídos:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (ico) => {
        try {
            const response = await fetch(`${API_BASE_URL}api/exports/comments/markAsViewed/${ico}`, {
                method: 'PUT',
                credentials: 'include',
            });
            
            if (response.ok) {
                setUnreadComments(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(ico);
                    return newSet;
                });
            }
        } catch (error) {
            console.error('Error marcando comentarios como leídos:', error);
        }
    };

    const addUnreadComment = (ico) => {
        setUnreadComments(prev => new Set([...prev, ico]));
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
        loading
    };
};
