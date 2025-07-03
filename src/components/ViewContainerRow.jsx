import React from 'react';
import commentsButton from '../assets/img/commentsButton.webp';

export function ViewContainerRow({ item, role, onCommentsClick, onAnnouncementsClick }) {
  return {
    ...item,
    comments: (
      <div className='flex flex-row justify-center items-center m-auto'>
        {item.comments}
        <button className='btn-class max-w-[20%]' onClick={() => onCommentsClick(item)}>
          <img src={commentsButton} alt='Comments' />
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