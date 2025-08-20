import React from 'react';
import { useTranslation } from 'react-i18next';

export const OptionsPopup = ({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    type = 'warning',
}) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'error':
                return 'border-red-500 bg-red-50';
            case 'warning':
                return 'border-yellow-500 bg-yellow-50';
            case 'success':
                return 'border-green-500 bg-green-50';
            default:
                return 'border-blue-500 bg-blue-50';
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className={`bg-beige border-2 ${getTypeStyles()} p-6 max-w-md w-full mx-4 shadow-xl`}>
                {title && <h3 className='text-lg font-itf font-bold text-cafe mb-2'>{title}</h3>}
                {message && <p className='text-cafe font-itf mb-6'>{message}</p>}
                <div className='flex justify-end gap-3'>
                    <button
                        onClick={onCancel}
                        className='border border-cafe text-cafe px-4 py-2 font-itf hover:bg-beige/80'
                    >
                        {cancelText || t('Cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className='bg-naranja text-cafe px-4 py-2 font-itf hover:bg-yellow'
                    >
                        {confirmText || t('Confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};
