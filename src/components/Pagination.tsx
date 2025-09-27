"use client"
import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Create array of page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Previous */}
      <button
        className="px-3 py-1 flex items-center gap-2 rounded disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeftIcon /> Prev
      </button>

      {/* Page numbers */}
      <div className='xl:flex hidden gap-1'>
        {pages.map((page) => (
          <button
            key={page}
            className={`px-3  py-1 bg-accent rounded ${
              page === currentPage
                ? 'bg-primary text-white'
                : 'hover:bg-primary/70 hover:text-white'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <p className="xl:hidden">
        {currentPage} of {totalPages}
      </p>

      {/* Next */}
      <button
        className="px-3 flex items-center gap-2 py-1 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next <ArrowRightIcon />
      </button>
    </div>
  );
};

export default Pagination;