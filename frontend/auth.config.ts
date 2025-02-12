import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        // This is a temporary mock authentication
        // Replace this with your actual authentication logic
        if (credentials.email === 'user@example.com' && credentials.password === 'password') {
          return {
            id: '1',
            email: 'user@example.com',
            name: 'Test User',
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
