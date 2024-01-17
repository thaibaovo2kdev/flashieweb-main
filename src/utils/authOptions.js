import CredentialsProvider from 'next-auth/providers/credentials'
import { errorResponse } from '~/utils/helpers'
import axios from 'axios'

const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'sign-up',
      name: 'Two Factor Auth',
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'jsmith' },
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password, username, name, talksamId } = credentials

        try {
          const URI = `${process.env.NEXTAUTH_URL}/api/auth/signup`
          const { data } = await axios.post(URI, {
            username,
            email,
            password,
            name,
            talksamId,
          })
          return data
        } catch (error) {
          throw new Error(
            error?.response?.data?.errors?.[0]?.message ||
              error?.response?.data?.message ||
              'Server Error Occurred!'
          )
          // errorResponse(error)
        }
      },
    }),
    CredentialsProvider({
      id: 'sign-in',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // console.log(credentials, "signin");
        const { email, password } = credentials
        try {
          const URI = `${process.env.NEXTAUTH_URL}/api/auth/login`
          const { data } = await axios.post(URI, { email, password })
          return data
        } catch (error) {
          throw new Error(
            error?.response?.data?.errors?.[0]?.message ||
              error?.response?.data?.message ||
              'Server Error Occurred!'
          )
        }
      },
    }),
    CredentialsProvider({
      id: 'auth',
      name: 'Credentials',
      credentials: {
        id: { label: 'Id', type: 'text' },
        name: { label: 'name', type: 'text' },
        email: { label: 'email', type: 'text' },
        avatar: { label: 'avatar', type: 'text' },
      },
      async authorize(credentials, req) {
        return credentials
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') return { ...token, ...session.user }
      return { ...token, ...user }
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token

      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  //   secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
}

export default authOptions
