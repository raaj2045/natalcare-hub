'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import { redirect } from 'next/navigation';

const PastTrimester = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/patient/past-trimester');
    },
  });

  return (
    <div>
      <h1>Past Trimester</h1>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.role}</p>
    </div>
  );
};

export default PastTrimester;
