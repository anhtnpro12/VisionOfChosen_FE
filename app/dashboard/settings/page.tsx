"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  CloudIcon as Aws,
  Mail,
  Key,
  Shield,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Save,
  TestTube,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()

  // AWS Connection Settings
  const [awsSettings, setAwsSettings] = useState({
    accessKeyId: "AKIA****************",
    secretAccessKey: "************************************",
    region: "us-east-1",
    accountId: "123456789012",
    roleArn: "arn:aws:iam::123456789012:role/TerraformAnalyzerRole",
    sessionName: "terraform-drift-analyzer",
    isConnected: true,
    lastConnection: "2024-01-15 14:30:00",
  })

  // Email Notification Settings
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    emails: ["admin@company.com", "devops@company.com", "alerts@company.com"],
    newEmail: "",
    notifications: {
      driftDetected: true,
      scanCompleted: true,
      criticalIssues: true,
      weeklyReport: false,
      costAlerts: true,
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const handleSaveAWSSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "AWS Settings Saved",
        description: "Connection settings have been updated successfully",
      })
    }, 1500)
  }

  const handleTestAWSConnection = async () => {
    setIsTesting(true)
    // Simulate connection test
    setTimeout(() => {
      setIsTesting(false)
      setAwsSettings((prev) => ({
        ...prev,
        isConnected: true,
        lastConnection: new Date().toLocaleString(),
      }))
      toast({
        title: "Connection Test Successful",
        description: "Successfully connected to AWS with current credentials",
      })
    }, 3000)
  }

  const handleAddEmail = () => {
    if (emailSettings.newEmail && !emailSettings.emails.includes(emailSettings.newEmail)) {
      setEmailSettings((prev) => ({
        ...prev,
        emails: [...prev.emails, prev.newEmail],
        newEmail: "",
      }))
      toast({
        title: "Email Added",
        description: `${emailSettings.newEmail} has been added to notification list`,
      })
    }
  }

  const handleRemoveEmail = (email: string) => {
    setEmailSettings((prev) => ({
      ...prev,
      emails: prev.emails.filter((e) => e !== email),
    }))
    toast({
      title: "Email Removed",
      description: `${email} has been removed from notification list`,
    })
  }

  const handleSaveEmailSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Email Settings Saved",
        description: "Notification preferences have been updated successfully",
      })
    }, 1500)
  }

  const handleNotificationToggle = (key: string, value: boolean) => {
    setEmailSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">Manage AWS connections and notification preferences</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="aws" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="aws" className="flex items-center gap-2">
              <Aws className="h-4 w-4" />
              AWS Connection
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aws" className="space-y-6">
            {/* AWS Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Connection Status
                </CardTitle>
                <CardDescription>Current AWS connection information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {awsSettings.isConnected ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Connected</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="font-medium">Disconnected</span>
                      </>
                    )}
                  </div>
                  <Badge variant={awsSettings.isConnected ? "secondary" : "destructive"}>
                    {awsSettings.isConnected ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Account ID:</span>
                    <p className="font-mono">{awsSettings.accountId}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Region:</span>
                    <p className="font-mono">{awsSettings.region}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Connection:</span>
                    <p>{awsSettings.lastConnection}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Role ARN:</span>
                    <p className="font-mono text-xs truncate">{awsSettings.roleArn}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AWS Credentials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  AWS Credentials
                </CardTitle>
                <CardDescription>Configure your AWS access credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Credentials are encrypted and stored securely. We recommend using IAM roles with minimal required
                    permissions.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessKeyId">Access Key ID</Label>
                    <Input
                      id="accessKeyId"
                      type="password"
                      value={awsSettings.accessKeyId}
                      onChange={(e) => setAwsSettings((prev) => ({ ...prev, accessKeyId: e.target.value }))}
                      placeholder="AKIA****************"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secretAccessKey">Secret Access Key</Label>
                    <Input
                      id="secretAccessKey"
                      type="password"
                      value={awsSettings.secretAccessKey}
                      onChange={(e) => setAwsSettings((prev) => ({ ...prev, secretAccessKey: e.target.value }))}
                      placeholder="************************************"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Default Region</Label>
                    <Input
                      id="region"
                      value={awsSettings.region}
                      onChange={(e) => setAwsSettings((prev) => ({ ...prev, region: e.target.value }))}
                      placeholder="us-east-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleArn">IAM Role ARN (Optional)</Label>
                    <Input
                      id="roleArn"
                      value={awsSettings.roleArn}
                      onChange={(e) => setAwsSettings((prev) => ({ ...prev, roleArn: e.target.value }))}
                      placeholder="arn:aws:iam::123456789012:role/TerraformRole"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionName">Session Name</Label>
                  <Input
                    id="sessionName"
                    value={awsSettings.sessionName}
                    onChange={(e) => setAwsSettings((prev) => ({ ...prev, sessionName: e.target.value }))}
                    placeholder="terraform-drift-analyzer"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleTestAWSConnection} variant="outline" disabled={isTesting}>
                    {isTesting ? (
                      <>
                        <TestTube className="h-4 w-4 mr-2 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  <Button onClick={handleSaveAWSSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Email Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>Configure email alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enable/Disable Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email alerts for important events and updates
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enabled}
                    onCheckedChange={(checked) => setEmailSettings((prev) => ({ ...prev, enabled: checked }))}
                  />
                </div>

                <Separator />

                {/* Email List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Notification Recipients</Label>
                    <Badge variant="outline">{emailSettings.emails.length} emails</Badge>
                  </div>

                  <div className="space-y-2">
                    {emailSettings.emails.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Email */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email address"
                      value={emailSettings.newEmail}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, newEmail: e.target.value }))}
                      onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                      type="email"
                    />
                    <Button onClick={handleAddEmail} disabled={!emailSettings.newEmail}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Notification Types */}
                <div className="space-y-4">
                  <Label className="text-base">Notification Types</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Drift Detected</Label>
                        <p className="text-sm text-muted-foreground">Alert when infrastructure drift is detected</p>
                      </div>
                      <Switch
                        checked={emailSettings.notifications.driftDetected}
                        onCheckedChange={(checked) => handleNotificationToggle("driftDetected", checked)}
                        disabled={!emailSettings.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Scan Completed</Label>
                        <p className="text-sm text-muted-foreground">Notify when infrastructure scans are completed</p>
                      </div>
                      <Switch
                        checked={emailSettings.notifications.scanCompleted}
                        onCheckedChange={(checked) => handleNotificationToggle("scanCompleted", checked)}
                        disabled={!emailSettings.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Critical Issues</Label>
                        <p className="text-sm text-muted-foreground">Immediate alerts for high-risk security issues</p>
                      </div>
                      <Switch
                        checked={emailSettings.notifications.criticalIssues}
                        onCheckedChange={(checked) => handleNotificationToggle("criticalIssues", checked)}
                        disabled={!emailSettings.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cost Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify about significant cost changes</p>
                      </div>
                      <Switch
                        checked={emailSettings.notifications.costAlerts}
                        onCheckedChange={(checked) => handleNotificationToggle("costAlerts", checked)}
                        disabled={!emailSettings.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Report</Label>
                        <p className="text-sm text-muted-foreground">Weekly summary of infrastructure status</p>
                      </div>
                      <Switch
                        checked={emailSettings.notifications.weeklyReport}
                        onCheckedChange={(checked) => handleNotificationToggle("weeklyReport", checked)}
                        disabled={!emailSettings.enabled}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveEmailSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Notification Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
