"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", username, password)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background gradients */}
      <div className="absolute bottom-0 left-0 w-1/2 h-40 bg-gradient-to-r from-pink-500 to-transparent rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-40 bg-gradient-to-l from-purple-600 to-transparent rounded-full filter blur-3xl opacity-50"></div>

      {/* Logo and title */}
      <div className="mb-8 flex flex-col items-center">
        <Image src='/images/logo.svg' width={200} height={200} alt="logo image" />
        <h1 className="text-white text-4xl font-bold tracking-wider">COLLABSPHERE</h1>
      </div>

      {/* Login container */}
      <div className="relative w-full max-w-2xl"> {/* Increased width */}
        <div className="bg-gray-900 rounded-xl p-12 shadow-2xl"> {/* Increased padding */}
          <form onSubmit={handleSubmit} className="space-y-8"> {/* Increased spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"> {/* Responsive layout */}
              <div className="space-y-6 w-full">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-white">Username</label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e:any) => setUsername(e.target.value)}
                    className="bg-gray-200 text-gray-900 border-0 w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-white">Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e:any) => setPassword(e.target.value)}
                    className="bg-gray-200 text-gray-900 border-0 w-full"
                    required
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-gray-200 text-gray-700 flex items-center justify-center gap-2"
                  type="button"
                >
                  <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
                  Login with Google
                </Button>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white" type="submit">
                  Login to Account
                </Button>
              </div>
              
              <div className="flex items-center justify-center w-full">
                <Image
                  src="/images/stu.png"
                  alt="Student reading"
                  width={200}
                  height={250}
                  className="object-contain"
                />
              </div>
            </div>
          </form>
        
        </div>
      </div>
    </div>
  )
}