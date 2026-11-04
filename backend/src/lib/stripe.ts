import Stripe from 'stripe';
import { config } from '../config';

// null until STRIPE_SECRET_KEY is set: the payment routes answer 503 and the rest of the app runs.
export const stripe: Stripe | null = config.stripeSecretKey ? new Stripe(config.stripeSecretKey) : null;

// A client built on first use, for code that keeps its own handle: without a key the first call throws inside its
// request, where the route answers its error, instead of stopping the server when the module loads.
export function lazyStripe(apiKey: string = config.stripeSecretKey): Stripe {
  let client: Stripe | null = null;
  return new Proxy({} as Stripe, {
    get(_target, prop) {
      if (client === null) {
        if (apiKey === '') throw new Error('Stripe is not configured: set STRIPE_SECRET_KEY');
        client = new Stripe(apiKey);
      }
      const value: unknown = Reflect.get(client, prop, client);
      return typeof value === 'function' ? value.bind(client) : value;
    },
  });
}
