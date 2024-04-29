export { auth as middleware } from 'auth'

export const config = {
  matcher: ['/', '/invite/:path*', '/servers/:path*'],
}
