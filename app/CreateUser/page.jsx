"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, setDoc, getDocs, doc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast"
import { createUserWithEmailAndPassword } from "firebase/auth";
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



const CreateUser = () => {
  const [userList, setUserList] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [newUser, setNewUser] = useState({ email: '', role: 'patient', password: '' });

  const { toast } = useToast()

  const handleAddUser = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);


      await setDoc(doc(db, "users", userCredentials.user.uid), {
        email: newUser.email,
        role: newUser.role
      });

      const newUserData = { id: userCredentials.user.uid, email: newUser.email, role: newUser.role };

      setUserList(prevUsers => [...prevUsers, newUserData]);
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
      const firestoreUsers = []

      const querySnapshot = await getDocs(collection(db, "users"));

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        firestoreUsers.push({ id: doc.id, ...doc.data() })
      });

      setUserList(firestoreUsers)
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
      await setDoc(doc(db, "users", userId), {
        ...updatedUser
      });

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
