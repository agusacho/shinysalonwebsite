import { createRefreshAuthRouter } from '@insforge/sdk/ssr';

// This creates a POST handler for refreshing the auth token.
// The browser client created with createBrowserClient() will automatically call this route when needed.
export const { POST } = createRefreshAuthRouter({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
});
