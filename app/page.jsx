import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Users } from 'lucide-react';
import React from 'react';

const Home = () => {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <header className="py-10">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Welcome to NatalCare Hub
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Empowering expecting mothers with comprehensive prenatal care.
      </p>

    </header>

    <main>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Key Features
          </CardTitle>
          <List className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">

            <li className="mb-2">
              <span className="font-semibold">Track Appointments:</span><span className="leading-7 [&:not(:first-child)]:mt-6">Never miss an important prenatal visit or scan.</span>
            </li>
            <li className="mb-2">
              <span className="font-semibold">Access Trimester-Specific Information:</span> <span className="leading-7 [&:not(:first-child)]:mt-6">Stay informed with helpful tips and resources.</span>
            </li>
            <li className="mb-2">
              <span className="font-semibold">User-Friendly Interface:</span><span className="leading-7 [&:not(:first-child)]:mt-6"> Easy to use for expecting mothers and healthcare providers alike.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  </div>;
};

export default Home;
