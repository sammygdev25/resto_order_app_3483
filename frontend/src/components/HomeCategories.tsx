import { Section, Grid, Card, CardBody, CardTitle } from '../components/ui';
import { Icon } from '../components/icons';
import type { Category } from '../types';

interface HomeCategoriesProps {
  categories: Category[];
}

const CATEGORY_ICONS: Record<string, 'tag' | 'book' | 'star'> = {};

function iconFor(index: number): 'tag' | 'book' | 'star' {
  const icons: Array<'tag' | 'book' | 'star'> = ['tag', 'book', 'star'];
  return icons[index % icons.length];
}

export default function HomeCategories({ categories }: HomeCategoriesProps) {
  return (
    <Section
      eyebrow="Our Menu"
      title="Browse by category"
      subtitle="From starters to desserts, find exactly what you're craving."
    >
      {categories.length === 0 ? (
        <p className="ds-muted">Categories will appear here once the menu is set up.</p>
      ) : (
        <Grid size="sm">
          {categories.map((category, index) => (
            <Card key={category.id} to={`/dishes?category=${encodeURIComponent(category.name)}`}>
              <CardBody>
                <Icon name={CATEGORY_ICONS[category.name] ?? iconFor(index)} size={28} />
                <CardTitle>{category.name}</CardTitle>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}