import { Section, Split, Stack, Card, CardBody } from '../components/ui';
import { Icon } from '../components/icons';
import type { IconName } from '../components/icons';

interface ValuePoint {
  icon: IconName;
  title: string;
  text: string;
}

interface HomeAboutProps {
  title?: string;
  eyebrow?: string;
  story?: string;
  values?: ValuePoint[];
}

const DEFAULT_VALUES: ValuePoint[] = [
  {
    icon: 'award',
    title: 'Seasonal ingredients',
    text: 'We source produce daily from local growers and change the menu with the seasons.',
  },
  {
    icon: 'clock',
    title: 'Made to order',
    text: 'Every dish is cooked fresh once you order it, whether you dine in, pick up, or get it delivered.',
  },
  {
    icon: 'heart',
    title: 'Family run',
    text: 'Three generations in the kitchen, sharing recipes passed down and refined over the years.',
  },
];

export default function HomeAbout({
  title = 'Our story',
  eyebrow = 'About us',
  story = `Resto Order App started as a single family table and grew into a neighborhood kitchen where
  ordering online, dining in, and reserving a table for a celebration all feel like part of the same
  warm welcome. We built this app so you can browse the full menu, order ahead for pickup or delivery,
  and book a table in a few taps, while our kitchen keeps doing what it does best: cooking real food,
  the same way we always have.`,
  values = DEFAULT_VALUES,
}: HomeAboutProps) {
  return (
    <Section eyebrow={eyebrow} title={title}>
      <Split>
        <Stack gap="md">
          <p className="ds-lead">{story}</p>
        </Stack>
        <Stack gap="md">
          {values.map((value) => (
            <Card key={value.title}>
              <CardBody>
                <Stack gap="sm" align="center">
                  <Icon name={value.icon} size={22} />
                  <div>
                    <h3 className="ds-card-title">{value.title}</h3>
                    <p className="ds-muted">{value.text}</p>
                  </div>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Stack>
      </Split>
    </Section>
  );
}