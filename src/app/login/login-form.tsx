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
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/context/auth-context'

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [messageType, setMessageType] = useState<'error' | 'success'>('error')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMismatch, setPasswordMismatch] = useState(false)

    const router = useRouter()
    const supabase = createClient()
    const { showSuccessToast } = useAuth()

    // Client-side login - much faster than server action
    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(error.message)
            setMessageType('error')
            setIsLoading(false)
        }
        // Success is handled by AuthProvider's onAuthStateChange
        // which shows toast and redirects to home
    }

    // Client-side signup
    async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // Check password match before submitting
        if (password !== confirmPassword) {
            setPasswordMismatch(true)
            return
        }
        setPasswordMismatch(false)
        setIsLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const firstName = formData.get('first_name') as string
        const lastName = formData.get('last_name') as string
        const birthday = formData.get('birthday') as string || null
        const gender = formData.get('gender') as string || null

        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`,
                    birthday,
                    gender,
                },
            },
        })

        if (error) {
            setMessage(error.message)
            setMessageType('error')
            setIsLoading(false)
            return
        }

        if (data.session) {
            // User is auto-confirmed - AuthProvider will handle redirect
        } else {
            // Email confirmation required
            setMessage('Check your email to confirm your account!')
            setMessageType('success')
            setIsLoading(false)
        }
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
                            <form onSubmit={handleLogin}>
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
                                        <div className={`text-sm p-3 rounded-md font-medium ${messageType === 'error'
                                                ? 'bg-destructive/10 text-destructive'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {message}
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {isLoading ? 'Logging in...' : 'Log In'}
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
                            <form onSubmit={handleSignup}>
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
                                        <Label htmlFor="signup_email">Email</Label>
                                        <Input id="signup_email" name="email" type="email" placeholder="m@example.com" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup_password">Password</Label>
                                        <Input
                                            id="signup_password"
                                            name="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm_password">Confirm Password</Label>
                                        <Input
                                            id="confirm_password"
                                            name="confirm_password"
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                            className={passwordMismatch ? 'border-destructive' : ''}
                                        />
                                        {passwordMismatch && (
                                            <p className="text-xs text-destructive flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> Passwords do not match
                                            </p>
                                        )}
                                    </div>

                                    {/* Optional Fields */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="birthday">Birthday (Optional)</Label>
                                            <Input id="birthday" name="birthday" type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender (Optional)</Label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            >
                                                <option value="">Prefer not to say</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`text-sm p-3 rounded-md font-medium ${messageType === 'error'
                                                ? 'bg-destructive/10 text-destructive'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {message}
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full" disabled={isLoading || passwordMismatch}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {isLoading ? 'Creating Account...' : 'Create Account'}
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
