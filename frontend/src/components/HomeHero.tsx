import { Hero, Button, Media } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeHeroProps {
  imageUrl?: string;
}

export default function HomeHero({ imageUrl = '/img/brand/hero.jpg' }: HomeHeroProps) {
  return (
    <Hero
      eyebrow="Ember & Oak Kitchen"
      title="Wood-fired flavor, booked and delivered your way"
      text="Order chef-crafted dishes for pickup or delivery, or reserve a table for an evening by the hearth. Every plate is made fresh from our wood-fired kitchen, right down the street."
      actions={
        <>
          <Button variant="primary" size="lg" to="/dishes">
            View the menu
            <Icon name="arrow-right" size={18} />
          </Button>
          <Button variant="ghost" size="lg" to="/reservations">
            Reserve a table
          </Button>
        </>
      }
      media={
        imageUrl ? (
          <Media src={imageUrl} alt="Wood-fired dishes at Ember & Oak Kitchen" ratio="wide" />
        ) : undefined
      }
    />
  );
}