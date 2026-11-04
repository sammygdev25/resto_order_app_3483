import { Button } from '../components/ui';
import { Icon } from '../components/icons';

interface DishListPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DishListPagination({ page, totalPages, onPageChange }: DishListPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="ds-pagination" aria-label="Dish list pagination">
      <Button
        variant="ghost"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <Icon name="chevron-left" size={16} />
        Previous
      </Button>
      <span className="ds-muted">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="ghost"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
        <Icon name="chevron-right" size={16} />
      </Button>
    </nav>
  );
}