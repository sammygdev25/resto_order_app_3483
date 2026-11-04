import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media, Button, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Dish } from '../types';

interface HomeFeaturedProps {
  dishes: Dish[];
  loading?: boolean;
  onAddToCart: (dish: Dish) => void;
}

export default function HomeFeatured({ dishes, loading, onAddToCart }: HomeFeaturedProps) {
  const featured = dishes.slice(0, 8);

  return (
    <Section
      eyebrow="From the kitchen"
      title="Featured dishes"
      subtitle="Chef's picks, made fresh daily with seasonal ingredients and served hot to your table or door."
    >
      {loading ? (
        <SkeletonCards count={8} />
      ) : featured.length === 0 ? (
        <EmptyState
          icon="package"
          title="No dishes yet"
          text="Our menu is being prepared. Check back soon for our featured selections."
        />
      ) : (
        <Grid size="md" cols={4}>
          {featured.map((dish) => (
            <Card key={dish.id}>
              <Media src={dish.imageUrl} alt={dish.name} ratio="square" />
              <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                {dish.description && <CardMeta>{dish.description}</CardMeta>}
                <CardFooter>
                  <Price value={dish.price} />
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onAddToCart(dish)}
                    disabled={!dish.isAvailable}
                  >
                    <Icon name="cart" size={16} />
                    {dish.isAvailable ? 'Add to cart' : 'Sold out'}
                  </Button>
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}