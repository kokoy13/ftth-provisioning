import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationMeta, getPageNumbers } from "../../helpers";

/**
 * Reusable pagination controls component.
 */
const PaginationControls = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const { totalPages, startItem, endItem, hasPrev, hasNext } = getPaginationMeta(
    totalItems,
    currentPage,
    pageSize
  );
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
      {/* Item count display */}
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700">{startItem}</span>–
        <span className="font-medium text-slate-700">{endItem}</span> of{" "}
        <span className="font-medium text-slate-700">{totalItems}</span>
      </p>

      {/* Page navigation buttons */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page number buttons */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-gray-900 text-white"
                : "text-slate-600 hover:bg-slate-100 border border-slate-300"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
};

export default PaginationControls;
