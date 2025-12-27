'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import { login, signup } from './actions'

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMismatch, setPasswordMismatch] = useState(false)

    async function handleLogin(formData: FormData) {
        setIsLoading(true)
        setMessage(null)
        const res = await login(formData)
        if (res?.error) {
            setMessage(res.error)
            setIsLoading(false)
        }
        // If success, redirect happens in server action
    }

    async function handleSignup(formData: FormData) {
        // Check password match before submitting
        if (password !== confirmPassword) {
            setPasswordMismatch(true)
            return
        }
        setPasswordMismatch(false)
        setIsLoading(true)
        setMessage(null)
        const res = await signup(formData)
        if (res?.error) {
            setMessage(res.error)
        } else if (res?.success) {
            setMessage(res.message!)
        }
        setIsLoading(false)
    }

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value)
        if (password && value && password !== value) {
            setPasswordMismatch(true)
        } else {
            setPasswordMismatch(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <Tabs defaultValue="login" className="w-full max-w-[400px]">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* LOGIN TAB */}
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome Back</CardTitle>
                            <CardDescription>
                                Enter your credentials to access your wellness account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <form action={handleLogin}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" name="password" type="password" required />
                                    </div>
                                    {message && (
                                        <div className="text-sm p-3 rounded-md bg-destructive/10 text-destructive font-medium">
                                            {message}
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Log In
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* REGISTER TAB */}
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Account</CardTitle>
                            <CardDescription>
                                Start your wellness journey with us today.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <form action={handleSignup}>
                                <div className="space-y-4">
                                    {/* Name Fields - Side by Side */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">First Name</Label>
                                            <Input id="first_name" name="first_name" placeholder="John" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Last Name</Label>
                                            <Input id="last_name" name="last_name" placeholder="Doe" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <Input
                                            id="signup-password"
                                            name="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <Input
                                            id="confirm-password"
                                            name="confirm_password"
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                            className={passwordMismatch ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {passwordMismatch && (
                                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Passwords do not match
                                            </p>
                                        )}
                                    </div>

                                    {/* Optional Fields */}
                                    <div className="border-t pt-4 mt-4">
                                        <p className="text-xs text-muted-foreground mb-3">Optional Information</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="birthday">Birthday</Label>
                                                <Input id="birthday" name="birthday" type="date" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="gender">Gender</Label>
                                                <select
                                                    id="gender"
                                                    name="gender"
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Prefer not to say</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className="text-sm p-3 rounded-md bg-muted text-foreground font-medium border border-border">
                                            {message}
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full" disabled={isLoading || passwordMismatch}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Create Account
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
