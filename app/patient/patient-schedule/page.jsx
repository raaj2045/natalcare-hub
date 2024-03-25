'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import axios from 'axios';
import './index.css'

const localizer = momentLocalizer(moment)


const PatientSchedule = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  const [events, setEvents] = useState([])

  useEffect(() => {
    const getSchedules = async () => {
        const res = await axios.get('/api/get-user-schedule')
        let data = res.data.map(schedule => {
         return {
            start: schedule.date,
            end:  schedule.date,
            title: `${schedule.type}: ${schedule.description}`
          }
        })
        setEvents(data)
    }
    getSchedules()
  }, [])
  

  return (
    <div className='container mx-auto py-6'>
      <Card>
        <CardHeader><CardTitle>My Schedule</CardTitle></CardHeader>
        <CardContent>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={{month:true}}
            style={{ height: 600 }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientSchedule;
