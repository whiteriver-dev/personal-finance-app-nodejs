import React from 'react';
import './PaginationButtons.scss';

function PaginationButtons({ currentPage, totalPages, onPageChange }) {
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push('...');
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="pagination">
      <button 
        className="pagination__nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <div className="pagination__pages">
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={index} className="pagination__dots">…</span>
          ) : (
            <button
              key={page}
              className={`pagination__page ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button 
        className="pagination__nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default PaginationButtons;
