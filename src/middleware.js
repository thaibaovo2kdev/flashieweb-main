import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const teacherPages = ['/course-management', '/flashset-management']

function middleware(req) {
  const isLoginPage = req.nextUrl.pathname.startsWith('/login')
  const isSignupPage = req.nextUrl.pathname.startsWith('/signup')
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isResetPasswordPage = req.nextUrl.pathname.startsWith('/reset-password')
  if (req.nextUrl.pathname.includes('/import')) {
    return NextResponse.next()
  }
  if (req.nextUrl.pathname.startsWith('/img')) {
    return NextResponse.next()
  }

  if (isAuthPage) return NextResponse.next()
  if (
    req.nextUrl.searchParams.get('uid') &&
    req.nextUrl.searchParams.get('uname')
  ) {
    const redirect = new URL(
      '/auth?callback=' +
        encodeURIComponent(
          req.nextUrl.href?.replace('localhost:3000', 'flashie.englishwing.com')
        ),
      req.url
    )
    return NextResponse.redirect(redirect)
  }

  // if (isLoginPage || isSignupPage || isResetPasswordPage) {
  //   if (!req.nextauth.token) {
  //     return NextResponse.next()
  //   }
  // }

  // if (!req.nextauth.token) {
  //   if (
  //     req.nextUrl.pathname.startsWith('/api') &&
  //     !req.nextUrl.pathname.includes('/import')
  //   ) {
  //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  //   }
  //   console.log(req.nextUrl.pathname, 'req.nextUrl.pathname')
  //   if (req.nextUrl.pathname === '/') {
  //     return NextResponse.next()
  //   }
  //   const redirect = new URL('/login', req.url)
  //   return NextResponse.redirect(redirect)
  // }
  if (req.nextUrl.pathname === '/') {
    const redirect = new URL('/home', req.url)
    return NextResponse.redirect(redirect)
  }
  if (
    req.nextauth.token?.type !== 'teacher' &&
    teacherPages.some((page) => req.nextUrl.pathname.startsWith(page))
  ) {
    const redirect = new URL('/', req.url)
    return NextResponse.redirect(redirect)
  }

  return NextResponse.next()
  // if (req.nextUrl.pathname.startsWith('/admin')) {
  //   if (req.nextauth.token?.role === 'admin') {
  //     return NextResponse.next();
  //   }

  //   const redirect = new URL('/', req.url);
  //   return NextResponse.redirect(redirect);
  // }

  //   const redirect = new URL('/', req.url);
  //   return NextResponse.redirect(redirect);
  // }
}

const callbacks = {
  authorized: ({ token, req }) => {
    // if (!token && !req.nextUrl.pathname.includes('/api/')) {
    //   return false
    // }
    // const login = req.nextUrl.pathname === '/login'
    // const signup = req.nextUrl.pathname === '/signup'

    // if ((login || signup) && !token) return true

    // return token && token.email ? true : false;
    return true
  },
}

export default withAuth(middleware, { callbacks })

export const config = {
  matcher: ['/api/:path*', '/:path*'],
}
