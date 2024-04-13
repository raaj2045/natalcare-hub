import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"


export default withAuth(function middleware(req) {
    console.log(req.nextUrl.pathname)
    console.log(req.nextauth.token.role)
    if (req.nextUrl.pathname.startsWith('/create-user') && req.nextauth.token.role.toLowerCase() != 'admin') {
        return NextResponse.rewrite(new URL('/denied', req.url))
    }

    if (
        (
            req.nextUrl.pathname.startsWith('/doctor')
        )

        && req.nextauth.token.role.toLowerCase() != 'doctor') {
        return NextResponse.rewrite(new URL('/denied', req.url))
    }

    if (
        (
            req.nextUrl.pathname.startsWith('/patient')
        )

        && req.nextauth.token.role.toLowerCase() != 'patient') {
        return NextResponse.rewrite(new URL('/denied', req.url))
    }
}, {
    callbacks: {
        authorized: ({ token }) => !!token
    }
})



export const config = {
    matcher: [
        "/create-user",
        "/doctor/manage-patients",
        "/doctor/scheduler",
        "/patient/patient-schedule",
        "/patient/trimester"
    ]
}