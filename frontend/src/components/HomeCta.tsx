import { Section, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeCtaProps {
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export default function HomeCta({
  title = 'Hungry already?',
  text = 'Browse our menu of wood-fired classics and fresh seasonal plates, or reserve a table for tonight.',
  ctaLabel = 'View the menu',
  ctaTo = '/dishes',
}: HomeCtaProps) {
  return (
    <Section tight>
      <div className="ds-cta-banner ds-between">
        <div>
          <h2 className="ds-card-title">{title}</h2>
          <p className="ds-lead">{text}</p>
        </div>
        <Button variant="primary" size="lg" to={ctaTo}>
          {ctaLabel}
          <Icon name="arrow-right" size={18} />
        </Button>
      </div>
    </Section>
  );
}