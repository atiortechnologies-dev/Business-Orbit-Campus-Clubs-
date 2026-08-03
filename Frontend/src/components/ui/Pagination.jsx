import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span
            key={`dots-${index}`}
            className="px-3 py-1 flex items-center justify-center text-text-muted"
          >
            <MoreHorizontal size={16} />
          </span>
        );
      }

      const isActive = page === currentPage;
      return (
        <button
          key={page}
          onClick={() => handlePage(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-md font-inter text-small transition-colors ${
            isActive
              ? "bg-brand-black text-white font-semibold"
              : "text-text-body hover:bg-canvas-bg hover:text-text-heading"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => handlePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:bg-canvas-bg hover:text-text-heading transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      <div className="flex items-center gap-1">{renderPageNumbers()}</div>

      <button
        onClick={() => handlePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:bg-canvas-bg hover:text-text-heading transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next Page"
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
