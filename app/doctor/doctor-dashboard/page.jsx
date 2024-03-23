import { getServerSession } from 'next-auth';
import React from 'react';
import { options } from '../../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

const DoctorDashboard = async () => {
  const session = await getServerSession(options);

  if (!session) {
    console.log('Nothing in session');
    redirect('/api/auth/signin?callbackUrl=/doctor/doctor-dashboard');
  }

  return (
    <div>
      <h1>Doctor session</h1>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.role}</p>
    </div>
  );
};

export default DoctorDashboard;
