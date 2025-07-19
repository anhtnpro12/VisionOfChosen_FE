"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image'
import axiosClient from '@/api/axiosClient'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await axiosClient.post('/api/Auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      if (response.status === 200) {
        toast({
          title: "Đăng ký thành công",
          description: "Bạn đã đăng ký thành công, vui lòng đăng nhập hệ thống.",
        })
        setTimeout(() => {
          router.push("/auth/login")
        }, 1500)
      }
    } catch (error: any) {
      toast({
        title: "Đăng ký thất bại",
        description: error?.response?.data || "Đã có lỗi xảy ra.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-black"
      style={{ backgroundImage: "url('/BG_login.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <Card className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg text-white border border-white/80 shadow-2xl rounded-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-500/30 rounded-full shadow-md">
              <Image
                src="/logo-transparent.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-400">Đăng ký tài khoản</CardTitle>
          <CardDescription className="text-gray-300">Tạo tài khoản để bắt đầu sử dụng hệ thống</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">Họ và tên</Label>
              <Input
                id="name"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="bg-white/80 border border-white/80 text-white placeholder-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="bg-white/80 border border-white/80 text-white placeholder-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className="bg-white/80 border border-white/80 text-white placeholder-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-200">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                className="bg-white/80 border border-white/80 text-white placeholder-gray-300"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng ký
            </Button>
            <p className="text-sm text-center text-gray-300">
              Đã có tài khoản?{" "}
              <Link href="/auth/login" className="text-yellow-400 hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
