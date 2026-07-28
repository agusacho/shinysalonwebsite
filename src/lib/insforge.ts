import { createClient } from '@insforge/sdk';

if (!process.env.NEXT_PUBLIC_INSFORGE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_INSFORGE_URL');
}
if (!process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_INSFORGE_ANON_KEY');
}

export const insforge = createClient(
  process.env.NEXT_PUBLIC_INSFORGE_URL,
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
);
