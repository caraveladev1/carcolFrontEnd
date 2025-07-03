import React from 'react';

export function FilterContainer({ children, columns = 4 }) {
  const gridClass = `grid grid-cols-${columns} gap-4 mb-6 items-stretch`;
  
  return (
    <div className={gridClass}>
      {children}
    </div>
  );
}