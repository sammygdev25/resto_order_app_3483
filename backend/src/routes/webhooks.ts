import { Router, Request, Response } from 'express';

const router = Router();

// Stripe payment processing, checkout sessions and the verified Stripe
// webhook are all owned by the scaffold's backend/src/routes/payments.ts
// (POST /api/payments/checkout/, the webhook endpoint it registers, and
// GET /api/payments/status/). This domain never implements Stripe logic:
// an Order's paidAt / stripeSessionId columns are written only by that
// scaffold webhook, never by a route in this file.
//
// This file is kept as a stub so no legacy client request to
// /api/webhooks/stripe/ crashes the server; it performs no payment work.
router.post('/stripe', (_req: Request, res: Response) => {
  res.status(410).json({
    error: 'Stripe webhooks are handled by the payments module, not this route',
    code: 'moved',
  });
});

export default router;