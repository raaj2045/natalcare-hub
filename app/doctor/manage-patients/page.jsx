'use client';
import React, { useState, useEffect } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Button } from "@/components/ui/button"
import { useSession } from 'next-auth/react';
import DatePicker from '@/app/components/DatePicker';
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios';
import { redirect } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"

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
      console.log(patients[patientIndex])
      axios.post('/api/update-patient', {
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

  const setInfoForPatient = async (trimesterType, id, val) => {
 

    const patientIndex = patients.findIndex(patient => patient.id === id);

    // If the patient is found
    if (patientIndex !== -1) {
      // Create a copy of the patients array
      const updatedPatients = [...patients];
      // Update the field for the patient at the found index
      if (!updatedPatients[patientIndex][trimesterType]) {
        updatedPatients[patientIndex][trimesterType] = {};
      }

      if (!updatedPatients[patientIndex][trimesterType]['infoForPatient']) {
        updatedPatients[patientIndex][trimesterType]['infoForPatient'] = '';
      }

      updatedPatients[patientIndex][trimesterType]['infoForPatient'] = val;

      // Set the updated patients state
      setPatients(updatedPatients);
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
                      <DialogHeader>Manage Trimesters</DialogHeader>
                        <div className="flex items-center justify-center py-12">
                          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                            <AccordionItem value="item-1">
                              <AccordionTrigger>Trimester 1</AccordionTrigger>
                              <AccordionContent>
                                <div className='py-2'>
                                  <Label className='px-2'>Start Date</Label>
                                  <DatePicker date={user.trimester1?.startDate} setDate={(val) => setDate(new Date(val), 'trimester1', 'startDate', user.id)} text='Start Date' />
                                </div>
                                <div className='py-2'>
                                  <Label className='px-2'>End Date</Label>
                                  <DatePicker date={user.trimester1?.endDate} setDate={(val) => setDate(new Date(val), 'trimester1', 'endDate', user.id)} text='End Date' />
                                </div>
                                <div className='py-2 px-2'><Label>Information for Patient</Label><Textarea className="mt-3" value={user.trimester1?.infoForPatient} onChange={(e) => setInfoForPatient('trimester1',user.id, e.target.value)}/></div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                              <AccordionTrigger>Trimester 2</AccordionTrigger>
                              <AccordionContent>
                                <div className='py-2'>
                                  <Label className='px-2'>Start Date</Label>
                                  <DatePicker date={user.trimester2?.startDate} setDate={(val) => setDate(new Date(val), 'trimester2', 'startDate', user.id)} text='Start Date' />
                                </div>
                                <div className='py-2'>
                                  <Label className='px-2'>End Date</Label>
                                  <DatePicker date={user.trimester2?.endDate} setDate={(val) => setDate(new Date(val), 'trimester2', 'endDate', user.id)} text='End Date' />
                                </div> 
                                <div className='py-2 px-2'><Label className='pb-2'>Information for Patient</Label><Textarea className="mt-3" value={user.trimester2?.infoForPatient} onChange={(e) => setInfoForPatient('trimester2',user.id, e.target.value)}/></div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                              <AccordionTrigger>Trimester 3</AccordionTrigger>
                              <AccordionContent>
                                <div className='py-2'>
                                  <Label className='px-2'>Start Date</Label>
                                  <DatePicker date={user.trimester3?.startDate} setDate={(val) => setDate(new Date(val), 'trimester3', 'startDate', user.id)} text='Start Date' />
                                </div>
                                <div className='py-2'>
                                  <Label className='px-2'>End Date</Label>
                                  <DatePicker date={user.trimester3?.endDate} setDate={(val) => setDate(new Date(val), 'trimester3', 'endDate', user.id)} text='End Date' />
                                </div>
                                <div className='py-2 px-2'><Label className='pb-2'>Information for Patient</Label><Textarea className="mt-3" value={user.trimester3?.infoForPatient} onChange={(e) => setInfoForPatient('trimester3',user.id, e.target.value)}/></div>    
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button onClick={() => onSave(user.id)} type="submit">Save changes</Button>
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
