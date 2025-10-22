import React from 'react';
import './PageLayout.css';

export default function PageLayout({ children, className = '' }) {
  return (
    <div className={`page-layout ${className}`}>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}
