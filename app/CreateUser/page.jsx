"use client"

import React from 'react';
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Plus, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from 'axios';

const CreateUser = () => {
  const [userList, setUserList] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [newUser, setNewUser] = useState({ email: '', role: 'patient', password: '' });

  const { toast } = useToast()

  const handleAddUser = async () => {
    try {

      await axios.post('/api/add-user', {
        email: newUser.email, password: newUser.password, role: newUser.role
      })

      await fetchUsers()

      setNewUser({ email: '', role: '', password: '' }); // Clear input fields after adding user
      toast({
        title: "New User Created!",
        description: "User has been added successfully.",
      })

    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem adding the user. " + error.message,
      })
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/get-all-users')

      setUserList(res.data)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    // Toggle edit mode for the clicked user
    setEditMode(prevEditMode => ({
      ...prevEditMode,
      [userId]: !prevEditMode[userId]
    }));
  };

  const handleSave = async (userId) => {
    try {
      // Get updated user data from the userList state
      const updatedUser = userList.find(user => user.id === userId);
      // Update user data in Firestore

      await axios.post('/api/update-user', {
        ...updatedUser
      })

      toast({
        title: "User Saved!",
        description: "User has been saved successfully.",
      })

      // Disable edit mode for the saved user
      setEditMode(prevEditMode => ({
        ...prevEditMode,
        [userId]: false
      }));
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving the user. " + error.message,
      })
    }
  };


  const handleRoleChange = (value, userId) => {
    // Update the user data in the userList state when role selection changes
    const newRole = value;
    setUserList(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    }));
  };


  return (
    <div className="container mx-auto px-6">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>Add New Users to the System and edit Roles of Existing Users.</CardDescription>
        </CardHeader>
        <CardContent>

          <Table>
            <TableCaption>A list of users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><Input placeholder='Email' type="text" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} /></TableCell>
                <TableCell ><Input placeholder='Password' type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} /></TableCell>

                <TableCell>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><button onClick={handleAddUser}><Plus /></button></TableCell>
              </TableRow>
              {userList.map(user => (
                <TableRow key={user.id}>

                  <TableCell>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {editMode[user.id] ? (
                      <Select value={user.role} onValueChange={(e) => handleRoleChange(e, user.id)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="patient">Patient</SelectItem>
                            <SelectItem value="doctor">Doctor</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : user.role}
                  </TableCell>
                  <TableCell>
                    {editMode[user.id] ? (
                      <div> <button onClick={() => handleSave(user.id)} className="px-2"><Save /></button>
                        <button className="px-2" onClick={() => {
                          setEditMode(prevEditMode => ({
                            ...prevEditMode,
                            [user.id]: false
                          }));
                        }}><X /></button> </div>
                    ) : (
                      <div> <button onClick={() => handleEdit(user.id)} className="px-4"><Pencil /></button></div>
                    )}
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

export default CreateUser;
