'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp, addDoc } from "firebase/firestore";

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
import { Plus } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { useSession } from 'next-auth/react';
import DatePicker from '@/app/components/DatePicker';
import { useToast } from "@/components/ui/use-toast"
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { redirect } from 'next/navigation';

const Scheduler = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      redirect('/')
    },
  });

  const [newSchedule, setNewSchedule] = useState(
    {
      type: '',
      description: '',
      patientId: '',
      patientEmail: '',
      date: Timestamp.fromDate(new Date()),
      doctorId: ''
    })

  const [schedules, setSchedules] = useState([])
  const [patients, setPatients] = useState([])

  const { toast } = useToast()

  const fetchSchedules = async () => {
    try {
      const firestoreSchedules = []
      const q = query(collection(db, "schedules"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        firestoreSchedules.push({ id: doc.id, ...doc.data() })
      });


      return firestoreSchedules
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const firestorePatients = []
      const q = query(collection(db, "users"), where("role", "==", 'patient'));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        firestorePatients.push({ id: doc.id, email: doc.data().email })
      });


      return firestorePatients
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    async function callSchedulesAPI() {
      let data = await fetchSchedules()
      let patientData = await fetchPatients()
      setPatients(patientData)
      setSchedules(data)
      toast({
        title: "Schedules Fetched!",
        description: "Schedules have been retrieved successfully.",
      })
    }
    callSchedulesAPI()
  }, [])

  const addNewSchedule = async () => {
    try {
      let patientEmail = patients.find((val) => val.id === newSchedule.patientId)?.email

      await addDoc(collection(db, "schedules"), {
        ...newSchedule, doctorId: session.user.id, patientEmail
      });

      let data = await fetchSchedules();
      
      setSchedules(data)

      toast({
        title: "Schedule Added!",
        description: "Schedule has been added successfully.",
      })
    } catch (err) {
      console.log(err)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem adding the schedule. " + err.message,
      })
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
                <TableHead>Appointment Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Select value={newSchedule.patientId} onValueChange={(value) => setNewSchedule({ ...newSchedule, patientId: value })}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Patients</SelectLabel>
                        {patients.map(patient => <SelectItem key={patient.id} value={patient.id}>{patient.email}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Input placeholder='Type' type="text" value={newSchedule.type} onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value })} /></TableCell>
                <TableCell ><Input placeholder='Description' type="text" value={newSchedule.description} onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })} /></TableCell>
                <TableCell ><DatePicker date={newSchedule.date} text="Schedule Date" setDate={(val) => setNewSchedule({ ...newSchedule, date: Timestamp.fromDate(val) })} /></TableCell>

                <TableCell> <Button variant="outline" size="icon">
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Plus className="h-4 w-4" /></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will add a new schedule for the selected Patient.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={addNewSchedule}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Button></TableCell>
              </TableRow>
              {schedules.map(schedule => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    {schedule.patientEmail}
                  </TableCell>
                  <TableCell>
                    {schedule.type}
                  </TableCell>
                  <TableCell>
                    {schedule.description}
                  </TableCell>
                  <TableCell>
                    {format(schedule.date.toDate(), 'dd-MM-yy')}
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
