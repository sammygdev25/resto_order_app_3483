import type { Dish } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Media, Price, Badge, Button } from './ui';
import { Icon } from './icons';

interface DishCardProps {
  dish: Dish;
  onAddToCart: (dish: Dish) => void;
}

function DishCard({ dish, onAddToCart }: DishCardProps) {
  const unavailable = !dish.isAvailable;

  return (
    <Card className="dish-card">
      <Media
        src={dish.imageUrl || ''}
        alt={dish.name}
        ratio="wide"
        badge={
          unavailable ? (
            <Badge tone="danger">Sold out</Badge>
          ) : dish.category ? (
            <Badge tone="soft">{dish.category?.name}</Badge>
          ) : undefined
        }
      />
      <CardBody>
        <CardTitle>{dish.name}</CardTitle>
        {dish.description && <CardMeta>{dish.description}</CardMeta>}
        <CardFooter>
          <Price value={dish.price} />
          <Button
            variant="primary"
            disabled={unavailable}
            onClick={() => onAddToCart(dish)}
          >
            <Icon name="cart" size={16} />
            {unavailable ? 'Unavailable' : 'Add to cart'}
          </Button>
        </CardFooter>
      </CardBody>
    </Card>
  );
}

export { DishCard };
export default DishCard;