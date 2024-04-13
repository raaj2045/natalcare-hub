'use client'

import Link from 'next/link';
import React from 'react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { signOut, useSession } from 'next-auth/react';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';


import {
  CalendarCheck2,
  CalendarClock,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCcw,
  UserCog,
  Users,
} from "lucide-react"
import LoginDialog from './LoginDialog';

const Nav = ({ children }) => {

  const { data: session } = useSession();


  const menus = [
    {
      name: 'Create User',
      role: 'admin',
      href: "/CreateUser",
      icon: () => <Users />
    },
    {
      name: 'Patient Schedule',
      role: 'patient',
      href: "/patient/patient-schedule",
      icon: () => <CalendarCheck2 />
    },
    {
      name: 'Trimesters',
      role: 'patient',
      href: "/patient/trimester",
      icon: () => <RefreshCcw />
    },
    {
      name: 'Manage Patients',
      role: 'doctor',
      href: "/doctor/manage-patients",
      icon: () => <UserCog />
    },
    {
      name: 'Scheduler',
      role: 'doctor',
      href: "/doctor/scheduler",
      icon: () => <CalendarClock />
    }
  ]

  const filteredMenus = menus.filter(menu => menu.role === session?.user?.role?.toLowerCase()); // Adjust this based on your logic


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden  bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
             <HeartPulse />
              <span>NatalCare Hub</span>
            </Link>
          </div>
          {session?.user?.email ? 
          <div className="flex-1 border-r">
             <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {filteredMenus.map(menu => {
                return (
                  <Link
                    key={menu.name}
                    href={menu.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    {menu.icon()}
                    {menu.name}
                  </Link>
                )
              })}
            </nav> 
          </div>: null}
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">

                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <HeartPulse />
                  <span className="sr-only">NatalCare Hub</span>
                </Link>
                {session?.user?.email ?
                  filteredMenus.map(menu => {
                    return (<Link
                      key={menu.name}
                      href={menu.href}
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      {menu.icon()}
                      {menu.name}
                    </Link>)
                  }) : null}
              </nav>
            </SheetContent>
          </Sheet>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                {session ? (
                  <Button onClick={() => signOut({callbackUrl:'/'})}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Button>
                ) : (
                  <LoginDialog />
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Nav;
