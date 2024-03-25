'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';

const PastTrimester = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const getUser = async () => {
        const res = await axios.get('/api/get-user')
        setUserData(res.data)
    }
    getUser()
  }, [])

  return (
    <div className='container mx-auto py-6'>
    <Card>
      <CardHeader><CardTitle>Trimesters</CardTitle></CardHeader>
      <CardContent>
        {console.log(userData)}
      </CardContent>
    </Card>
  </div>
  );
};

export default PastTrimester;
