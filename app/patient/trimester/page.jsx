'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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

  const renderBadge = (startDate, endDate) => {
    const currentDate = new Date();

    if (currentDate < startDate) {
      return <Badge variant="outline">Upcoming</Badge>; // Appointment is in the future
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return <Badge variant="default">Ongoing</Badge>; // Appointment is currently happening
    } else {
      return <Badge variant="secondary">Past</Badge>; // Appointment has already occurred
    }
  }

  return (
    <div className='container mx-auto py-6'>
      <Card>
        <CardHeader><CardTitle>Trimesters</CardTitle></CardHeader>
        <CardContent>
          {userData?.trimester1 ?
            <Card className="my-2">
              <CardHeader><CardTitle>Trimester 1
                <span className='ml-2 mb-2'>{
                  renderBadge(new Date(userData?.trimester1?.startDate), new Date(userData?.trimester1?.endDate))
                }</span>
              </CardTitle> <div className="text-sm text-muted-foreground">{format(userData?.trimester1?.startDate, 'dd/MM/yy')} - {format(userData?.trimester1?.endDate, 'dd/MM/yy')}</div> </CardHeader>
              <CardContent>
                <pre className='whitespace-pre-wrap'>
                  {userData?.trimester1?.infoForPatient}
                </pre>
              </CardContent>

            </Card> : null}
          {userData?.trimester2 ?
            <Card className="my-2">
              <CardHeader><CardTitle>
                Trimester 2
                <span className='ml-2 mb-2'>{
                  renderBadge(new Date(userData?.trimester2?.startDate), new Date(userData?.trimester2?.endDate))
                }</span>
              </CardTitle><div className="text-sm text-muted-foreground">{format(userData?.trimester2?.startDate, 'dd/MM/yy')} - {format(userData?.trimester2?.endDate, 'dd/MM/yy')}</div></CardHeader>
              <CardContent>
                <pre className='whitespace-pre-wrap'>
                  {userData?.trimester2?.infoForPatient}
                </pre>
              </CardContent>
            </Card> : null}
          {userData?.trimester3 ?
            <Card className="my-2">
              <CardHeader>
                <CardTitle>Trimester 3 <span className='ml-2 mb-2'>
                  {renderBadge(new Date(userData?.trimester3?.startDate), new Date(userData?.trimester3?.endDate))}
                </span>
                </CardTitle>
                <div className="text-sm text-muted-foreground">{format(userData?.trimester3?.startDate, 'dd/MM/yy')} - {format(userData?.trimester3?.endDate, 'dd/MM/yy')}</div></CardHeader>
              <CardContent>

                <pre className='whitespace-pre-wrap'>
                  {userData?.trimester3?.infoForPatient}
                </pre>
              </CardContent>
            </Card> : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default PastTrimester;
