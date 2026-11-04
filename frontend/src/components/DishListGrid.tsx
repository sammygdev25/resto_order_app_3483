import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media, Badge, Button, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Dish } from '../types';

interface DishListGridProps {
  dishes: Dish[];
  loading?: boolean;
  error?: string | null;
  onAddToCart: (dish: Dish) => void;
  onClearFilters?: () => void;
}

export default function DishListGrid({ dishes, loading, error, onAddToCart, onClearFilters }: DishListGridProps) {
  if (loading) {
    return (
      <Section title="Our dishes" tight>
        <SkeletonCards count={6} />
      </Section>
    );
  }

  if (error) {
    return (
      <Section title="Our dishes" tight>
        <EmptyState icon="alert" title="Could not load the menu" text={error} />
      </Section>
    );
  }

  if (!dishes || dishes.length === 0) {
    return (
      <Section title="Our dishes" tight>
        <EmptyState
          icon="book"
          title="No dishes match your search"
          text="Try a different category or clear your filters to see the full menu."
          action={
            onClearFilters ? (
              <Button variant="primary" onClick={onClearFilters}>Clear filters</Button>
            ) : undefined
          }
        />
      </Section>
    );
  }

  return (
    <Section title="Our dishes" subtitle={`${dishes.length} dish${dishes.length === 1 ? '' : 'es'} on the table`} tight>
      <Grid size="md" cols={3}>
        {dishes.map((dish) => (
          <Card key={dish.id}>
            <Media
              src={dish.imageUrl}
              alt={dish.name}
              ratio="wide"
              badge={!dish.isAvailable ? 'Sold out' : dish.category?.name}
            />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              {dish.description && <CardMeta>{dish.description}</CardMeta>}
              <CardFooter>
                <Price value={dish.price} />
                {dish.isAvailable ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onAddToCart(dish)}
                  >
                    <Icon name="cart" size={16} /> Add to cart
                  </Button>
                ) : (
                  <Badge tone="neutral">Unavailable</Badge>
                )}
              </CardFooter>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}