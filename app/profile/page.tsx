"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

function ProfileContent() {
  const { user, logout, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [error, setError] = useState("")

  const handleEdit = () => {
    setIsEditing(true)
    setDisplayName(user?.displayName || "")
    setMessage(null)
    setError("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setDisplayName(user?.displayName || "")
    setError("")
    setMessage(null)
  }

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError("Display name cannot be empty")
      return
    }

    if (displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await updateProfile({ displayName: displayName.trim() })

      if (result.success) {
        setIsEditing(false)
        setMessage({ type: "success", text: "Profile updated successfully!" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setError("Failed to update profile")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account information</p>
        </div>

        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal details and account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">{user?.email}</p>
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Display Name</Label>
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value)
                        if (error) setError("")
                      }}
                      placeholder="Enter your display name"
                      className={error ? "border-destructive" : ""}
                      disabled={isLoading}
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={isLoading} size="sm">
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button variant="outline" onClick={handleCancel} disabled={isLoading} size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <p className="text-sm">{user?.displayName}</p>
                    <Button variant="ghost" size="sm" onClick={handleEdit}>
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">User ID</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs font-mono text-muted-foreground">{user?.id}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="destructive" onClick={handleLogout} className="sm:w-auto">
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your PagePilot usage overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Account Created</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">Active</p>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
