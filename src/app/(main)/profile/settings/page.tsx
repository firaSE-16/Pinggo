'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SettingsSkeleton } from "@/components/skeletons/UniversalSkeleton";
import { 
  Bell, 
  Shield, 
  Eye, 
  Palette, 
  Globe, 
  Smartphone, 
  Mail,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { useTheme } from "next-themes";
import { UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "@/components/Global/mode-toggle";
import Image from "next/image";

const SettingsPage = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
    mentions: true,
    follows: true,
    likes: true,
    comments: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowMessages: true,
    showLastSeen: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="container mx-auto px-2 md:px-6 py-8 max-w-3xl space-y-10">
      {/* User Info Card */}
      <Card className="glassy-card shadow-2xl rounded-3xl flex items-center gap-6 p-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <Image
            src={user?.imageUrl || '/default-avatar.png'}
            alt={user?.fullName || 'User'}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full border-2 border-primary object-cover shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.fullName || user?.username}</h2>
            <p className="text-muted-foreground text-lg">{user?.emailAddresses?.[0]?.emailAddress}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </Card>

      <div className="space-y-8">
        {/* Theme Settings */}
        <Card className="glassy-card shadow-xl rounded-2xl animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <Palette className="w-6 h-6" />
              Appearance
            </CardTitle>
            <CardDescription className="text-base">
              Customize how Pinggo looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-lg">Theme</Label>
                <p className="text-base text-muted-foreground">
                  Choose your preferred theme
                </p>
              </div>
              <ModeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glassy-card shadow-xl rounded-2xl animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <Bell className="w-6 h-6" />
              Notifications
            </CardTitle>
            <CardDescription className="text-base">
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your device
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Followers</Label>
                  <p className="text-sm text-muted-foreground">
                    When someone follows you
                  </p>
                </div>
                <Switch
                  checked={notifications.follows}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, follows: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Likes & Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    When someone likes or comments on your posts
                  </p>
                </div>
                <Switch
                  checked={notifications.likes}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, likes: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    When someone mentions you
                  </p>
                </div>
                <Switch
                  checked={notifications.mentions}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, mentions: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="glassy-card shadow-xl rounded-2xl animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <Shield className="w-6 h-6" />
              Privacy
            </CardTitle>
            <CardDescription className="text-base">
              Control who can see your profile and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Who can see your profile
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={privacy.profileVisibility === 'public' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPrivacy(prev => ({ ...prev, profileVisibility: 'public' }))}
                  >
                    Public
                  </Button>
                  <Button
                    variant={privacy.profileVisibility === 'private' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPrivacy(prev => ({ ...prev, profileVisibility: 'private' }))}
                  >
                    Private
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Show when you're online
                  </p>
                </div>
                <Switch
                  checked={privacy.showOnlineStatus}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, showOnlineStatus: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others send you messages
                  </p>
                </div>
                <Switch
                  checked={privacy.allowMessages}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, allowMessages: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Last Seen</Label>
                  <p className="text-sm text-muted-foreground">
                    Show when you were last active
                  </p>
                </div>
                <Switch
                  checked={privacy.showLastSeen}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, showLastSeen: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Mail className="w-4 h-4 mr-2" />
              Change Email
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Globe className="w-4 h-4 mr-2" />
              Language & Region
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full justify-start">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
