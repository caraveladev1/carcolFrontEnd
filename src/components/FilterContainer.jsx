import React from 'react';

export function FilterContainer({ children, columns = 4 }) {
  const getGridClass = () => {
    const gridClasses = {
      1: 'grid grid-cols-1 gap-4 mb-6 items-stretch',
      2: 'grid grid-cols-2 gap-4 mb-6 items-stretch',
      3: 'grid grid-cols-3 gap-4 mb-6 items-stretch',
      4: 'grid grid-cols-4 gap-4 mb-6 items-stretch',
      5: 'grid grid-cols-5 gap-4 mb-6 items-stretch',
      6: 'grid grid-cols-6 gap-4 mb-6 items-stretch',
      7: 'grid grid-cols-7 gap-4 mb-6 items-stretch',
      8: 'grid grid-cols-8 gap-4 mb-6 items-stretch',
      9: 'grid grid-cols-9 gap-4 mb-6 items-stretch',
      10: 'grid grid-cols-10 gap-4 mb-6 items-stretch',
      11: 'grid grid-cols-11 gap-4 mb-6 items-stretch',
      12: 'grid grid-cols-12 gap-4 mb-6 items-stretch',
    };
    return gridClasses[columns] || gridClasses[4];
  };
  
  return (
    <div className={getGridClass()}>
      {children}
    </div>
  );
}