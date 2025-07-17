import React from 'react';
import commentsButton from '../assets/img/commentsButton.webp';

export function ViewContainerRow({ item, role, onCommentsClick, getNotificationStatus }) {
  const notificationStatus = getNotificationStatus ? getNotificationStatus(item.ico) : 'none';
  let notificationColor = '';
  if (notificationStatus === 'unread') notificationColor = 'bg-green-500';
  if (notificationStatus === 'read') notificationColor = 'bg-red-500';

  return {
    ...item,
    comments: (
      <div className='flex flex-row justify-center items-center m-auto relative'>
        {item.comments}
        <button className='btn-class max-w-[20%] relative' onClick={() => onCommentsClick(item)}>
          <img src={commentsButton} alt='Comments' />
          {notificationStatus !== 'none' && (
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${notificationColor} rounded-full border-2 border-white`}></div>
          )}
        </button>
      </div>
    ),
  };
}