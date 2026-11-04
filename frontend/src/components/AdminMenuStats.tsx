import { Grid, Stat } from '../components/ui';
import type { Dish, Category } from '../types';

interface AdminMenuStatsProps {
  dishes: Dish[];
  categories: Category[];
}

export default function AdminMenuStats({ dishes, categories }: AdminMenuStatsProps) {
  const totalDishes = dishes.length;
  const availableDishes = dishes.filter((d) => d.isAvailable).length;
  const totalCategories = categories.length;
  const averagePrice =
    totalDishes > 0
      ? dishes.reduce((sum, d) => sum + Number(d.price), 0) / totalDishes
      : 0;

  return (
    <div className="ds-section">
      <Grid size="sm" cols={4}>
        <Stat
          value={String(totalDishes)}
          label="Dishes on the menu"
          icon="book"
        />
        <Stat
          value={String(availableDishes)}
          label="Currently available"
          icon="check"
        />
        <Stat
          value={String(totalCategories)}
          label="Categories"
          icon="grid"
        />
        <Stat
          value={`$${Number(averagePrice || 0).toFixed(2)}`}
          label="Average dish price"
          icon="dollar"
        />
      </Grid>
    </div>
  );
}