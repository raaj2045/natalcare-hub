'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, setDoc, doc, Timestamp } from "firebase/firestore";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from '@/app/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

import { Button } from "@/components/ui/button"
import { useSession } from 'next-auth/react';
import DatePicker from '@/app/components/DatePicker';
import { useToast } from "@/components/ui/use-toast"
import { format } from 'date-fns';

const Scheduler = () => {
  const { data: session } = useSession();
  const [schedules, setSchedules] = useState([])

  const { toast } = useToast()

  const fetchSchedules = async () => {
    try {
      const firestoreSchedules = []
      const q = query(collection(db, "schedules"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        firestoreSchedules.push({ id: doc.id, ...doc.data() })
      });
      console.log(firestoreSchedules)
      toast({
        title: "Schedules Fetched!",
        description: "Schedules have been retrieved successfully.",
      })
      return firestoreSchedules
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    async function callSchedulesAPI() {
      let data = await fetchSchedules()

      setSchedules(data)
    }
    callSchedulesAPI()
  }, [])

  const setDate = async (val, trimesterType, dateType, id) => {

    const patientIndex = patients.findIndex(patient => patient.id === id);

    // If the patient is found
    if (patientIndex !== -1) {
      // Create a copy of the patients array
      const updatedPatients = [...patients];

      // Update the field for the patient at the found index
      if (!updatedPatients[patientIndex][trimesterType]) {
        updatedPatients[patientIndex][trimesterType] = {};
      }

      if (!updatedPatients[patientIndex][trimesterType][dateType]) {
        updatedPatients[patientIndex][trimesterType][dateType] = {};
      }

      updatedPatients[patientIndex][trimesterType][dateType] = Timestamp.fromDate(val);

      // Set the updated patients state
      setPatients(updatedPatients);
    }

  }

  const onSave = async (id) => {
    const patientIndex = patients.findIndex(patient => patient.id === id)
    if (patientIndex !== -1) {

      setDoc(doc(db, "users", id), {
        ...patients[patientIndex]
      }).then((res) => {

        toast({
          title: "Dates Saved!",
          description: "Dates have been saved successfully.",
        })
      }).catch(err => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem saving the dates. " + err.message,
        })
      });

    }

  }

  return (
    <div className="container mx-auto px-6">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Manage Schedules</CardTitle>
          <CardDescription>Add Appointments for Patients.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of Schedules</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Email</TableHead>
                <TableHead>Scan Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map(schedule => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    {schedule.patientName}
                  </TableCell>
                  <TableCell>
                    {schedule.type}
                  </TableCell>
                  <TableCell>
                    {schedule.description}
                  </TableCell>
                  <TableCell>
                    {format(schedule.date.toDate(),'dd-MM-yy') }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scheduler;
