"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth/context";
import { updateProfile, updatePassword } from "@/app/actions/profile";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  display_name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
});

const privacySchema = z.object({
  is_profile_public: z.boolean(),
  show_reading_stats: z.boolean(),
  show_currently_reading: z.boolean(),
});

const passwordSchema = z.object({
  newPassword: z.string().min(8).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileInput = z.infer<typeof profileSchema>;
type PrivacyInput = z.infer<typeof privacySchema>;
type PasswordInput = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      display_name: profile?.display_name || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
    },
  });

  const privacyForm = useForm<PrivacyInput>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      is_profile_public: profile?.is_profile_public ?? true,
      show_reading_stats: profile?.show_reading_stats ?? true,
      show_currently_reading: profile?.show_currently_reading ?? true,
    },
  });

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileInput) => {
    setIsUpdating(true);
    try {
      const result = await updateProfile(data);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const onPrivacySubmit = async (data: PrivacyInput) => {
    setIsUpdating(true);
    try {
      const result = await updateProfile(data);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Privacy settings updated",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordInput) => {
    setIsUpdating(true);
    try {
      const result = await updatePassword(data.newPassword);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        passwordForm.reset();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile details and how others see you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...profileForm.register("username")}
                      disabled={isUpdating}
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      {...profileForm.register("display_name")}
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      {...profileForm.register("bio")}
                      disabled={isUpdating}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief description for your profile
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...profileForm.register("location")}
                      disabled={isUpdating}
                    />
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your reading activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      checked={privacyForm.watch("is_profile_public")}
                      onCheckedChange={(checked) =>
                        privacyForm.setValue("is_profile_public", checked)
                      }
                      disabled={isUpdating}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Reading Statistics</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your reading stats on your profile
                      </p>
                    </div>
                    <Switch
                      checked={privacyForm.watch("show_reading_stats")}
                      onCheckedChange={(checked) =>
                        privacyForm.setValue("show_reading_stats", checked)
                      }
                      disabled={isUpdating}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Currently Reading</Label>
                      <p className="text-sm text-muted-foreground">
                        Display books you're currently reading
                      </p>
                    </div>
                    <Switch
                      checked={privacyForm.watch("show_currently_reading")}
                      onCheckedChange={(checked) =>
                        privacyForm.setValue("show_currently_reading", checked)
                      }
                      disabled={isUpdating}
                    />
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Privacy Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register("newPassword")}
                      disabled={isUpdating}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                      disabled={isUpdating}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </form>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" disabled>
                    Enable 2FA (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
