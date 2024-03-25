'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import { redirect } from 'next/navigation';

const PatientDashboard = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  return (
    <div>
      <h1>Patient Dashboard</h1>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.role}</p>
    </div>
  );
};

export default PatientDashboard;
