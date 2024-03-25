'use client';
import React, { useState, useEffect } from 'react';
import {  setDoc, doc, Timestamp } from "firebase/firestore";

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
import axios from 'axios';
import { redirect } from 'next/navigation';

const ManagePatients = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      redirect('/')
    },
  });

  const [patients, setPatients] = useState([])

  const { toast } = useToast()

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/api/get-patients')
      
      toast({
        title: "Patients Fetched!",
        description: "Patients have been retrieved successfully.",
      })

      return res.data
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    async function callPatientsAPI() {
      let data = await fetchPatients()

      setPatients(data)
    }
    callPatientsAPI()
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

      updatedPatients[patientIndex][trimesterType][dateType] = val;

      // Set the updated patients state
      setPatients(updatedPatients);
    }

  }

  const onSave = async (id) => {
    const patientIndex = patients.findIndex(patient => patient.id === id)
    if (patientIndex !== -1) {
      axios.post('/api/update-patient', {
        ...patients[patientIndex]
      }).then((res) => {
        console.log(res)
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
          <CardTitle>Manage Patients</CardTitle>
          <CardDescription>Add Trimester Specific Information for Patients.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of Patients</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger>
                        <Pencil />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <div className="flex items-center justify-center py-12">
                          <Table>
                            <TableCaption>Trimesters</TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Trimester</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Trimester 1</TableCell>
                                <TableCell>
                                  <DatePicker date={user.trimester1?.startDate} setDate={(val) => setDate(new Date(val), 'trimester1', 'startDate', user.id)} text='Start Date' />
                                </TableCell>
                                <TableCell>
                                  <DatePicker date={user.trimester1?.endDate} setDate={(val) => setDate(new Date(val), 'trimester1', 'endDate', user.id)} text='End Date' />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Trimester 2</TableCell>
                                <TableCell>
                                  <DatePicker date={user.trimester2?.startDate} setDate={(val) => setDate(new Date(val), 'trimester2', 'startDate', user.id)} text='Start Date' />
                                </TableCell>
                                <TableCell>
                                  <DatePicker date={user.trimester2?.endDate} setDate={(val) => setDate(new Date(val), 'trimester2', 'endDate', user.id)} text='End Date' />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Trimester 3</TableCell>
                                <TableCell>
                                  <DatePicker date={user.trimester3?.startDate} setDate={(val) => setDate(new Date(val), 'trimester3', 'startDate', user.id)} text='Start Date' />
                                </TableCell>
                                <TableCell>
                                  <DatePicker date={user.trimester3?.endDate} setDate={(val) => setDate(new Date(val), 'trimester3', 'endDate', user.id)} text='End Date' />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button onClick={() =>  onSave(user.id)} type="submit">Save changes</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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

export default ManagePatients;
