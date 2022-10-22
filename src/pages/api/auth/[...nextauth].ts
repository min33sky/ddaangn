import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from '@/lib/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      // ? sendVerificationRequest를 사용해 아래 코드를 대체할 수 있는데 Vercel에서 안보내진다 머지
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      // sendVerificationRequest,
      maxAge: 10 * 60, // Magic links are valid for 10 min only
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt(params) {
      console.log(' ** jwt ** ', params);
      return params;
    },

    async session({ session, token, user }) {
      console.log(' ***** session ***** ', { session, token, user });

      session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };

      return session;
    },
  },
});
