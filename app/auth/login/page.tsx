"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image';
import axiosClient from '@/api/axiosClient';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axiosClient.post('/api/Auth/login', {
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        Cookies.set('access_token', token, { expires: 7 }); // Lưu token 7 ngày
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Không nhận được token từ server.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: error?.response?.data?.message || "Đã có lỗi xảy ra.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <CardTitle className="text-2xl font-bold text-yellow-400">Terraform Destroy Drift</CardTitle>
          <CardDescription className="text-gray-300">Đăng nhập để sử dụng hệ thống phân tích drift</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              Đăng nhập
            </Button>
            <p className="text-sm text-center text-gray-300">
              Chưa có tài khoản?{" "}
              <Link href="/auth/register" className="text-yellow-400 hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
