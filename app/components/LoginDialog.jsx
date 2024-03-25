import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

function LoginDialog() {

    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [error, setError] = useState('')

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Mail className="mr-2 h-4 w-4" /> Login with Email
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Login</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your email below to login to your account
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Input id="password" type="password" required value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)} />
                            </div>

                            {error !== '' ? <div className="grid gap-2"><p className="text-balance text-muted-foreground text-sm text-center text-red-700">
                                {error}
                            </p>
                            </div> : null}
                            <Button type="submit" className="w-full" onClick={async () => {
                                try {
                                    setError('')
                                    const res = await signIn("credentials", {
                                        username: userEmail,
                                        password: userPassword,
                                        redirect: false,
                                    });

                                    if(res.error){
                                        setError(res.error)
                                    }
                                } catch (err) {
                                    setError(err.message)
                                }
                            }
                            }>
                                Login
                            </Button>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default LoginDialog