import React from 'react';
import commentsButton from '../assets/img/commentsButton.webp';

export function ViewContainerRow({ item, role, onCommentsClick, onAnnouncementsClick, hasUnreadComments }) {
  return {
    ...item,
    comments: (
      <div className='flex flex-row justify-center items-center m-auto relative'>
        {item.comments}
        <button className='btn-class max-w-[20%] relative' onClick={() => onCommentsClick(item)}>
          <img src={commentsButton} alt='Comments' />
          {hasUnreadComments && hasUnreadComments(item.ico) && (
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white'></div>
          )}
        </button>
      </div>
    ),
    announcements:
      role === 'Admin' ? (
        <button className='btn-class bg-blue-500 text-white p-2' onClick={() => onAnnouncementsClick(item)}>
          Manage Announcements
        </button>
      ) : null,
  };
}