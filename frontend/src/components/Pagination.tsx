import React from 'react';

export type Props = {
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: Props) => {
    const pageNumbers = [];
    const startPage = Math.max(1, page - 2); // Start displaying pages 2 before the current page
    const endPage = Math.min(startPage + 4, pages); // Display a maximum of 5 pages

    // Adjust startPage if we are near the end of the pages
    const adjustedStartPage = Math.max(1, endPage - 4);

    for (let i = adjustedStartPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="justify-center flex">
            <ul className="flex border border-slate-300">
                {pageNumbers.map((number) => (
                    <li key={number} className={`px-2 py-1 ${page === number ? 'bg-gray-200' : ''}`}>
                        <button onClick={() => onPageChange(number)}>{number}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Pagination;

