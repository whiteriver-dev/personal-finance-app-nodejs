import React, { useEffect, useState } from 'react';
import './PaginationButtons.scss';

function PaginationButtons({ currentPage, totalPages, onPageChange }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 1) return pages;

    if (isMobile) {
      pages.push(1);

      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }

      if (totalPages !== 1) {
        pages.push(totalPages);
      }

      return [...new Set(pages)]; // remove duplicates
    }

    // Desktop logic: max 5 page buttons + prev/next
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

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
      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className="pagination__dots">…</span>
        ) : (
          <button
            key={`page-${page}`}
            className={`pagination__page ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page === 1 ? '« ' : ''}
            {page}
            {page === totalPages ? ' »' : ''}
          </button>
        )
      )}
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
