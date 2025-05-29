import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricUnitsManager } from "@/components/trainings/units/MetricUnitsManager";
import { Button } from "@/components/ui/button";
import { Settings, Database, Users, Bell, Shield, Activity } from "lucide-react";

const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("training");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-secondary shadow-lg">
            <Settings className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">System Settings</h1>
            <p className="text-muted-foreground">Configure and manage system-wide settings</p>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1 bg-card border">
          <TabsTrigger 
            value="training" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Training</span>
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger 
            value="database" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger 
            value="system" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Training Settings */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Training Configuration
              </CardTitle>
              <CardDescription>
                Manage training metrics, units, and performance tracking settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricUnitsManager />
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Settings */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Configure user roles, permissions, and registration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Default Roles</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure default role assignments for new users
                  </p>
                  <Button variant="outline" className="w-full">
                    Configure Role Settings
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Registration</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage user registration and approval processes
                  </p>
                  <Button variant="outline" className="w-full">
                    Registration Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Management
              </CardTitle>
              <CardDescription>
                Database maintenance, backups, and performance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Backup Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Schedule and manage database backups
                  </p>
                  <Button variant="outline" className="w-full">
                    Backup Settings
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor database performance and optimization
                  </p>
                  <Button variant="outline" className="w-full">
                    Performance Monitor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification System
              </CardTitle>
              <CardDescription>
                Configure system notifications and alert preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure email notification settings
                  </p>
                  <Button variant="outline" className="w-full">
                    Email Settings
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">System Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage system-wide alert configurations
                  </p>
                  <Button variant="outline" className="w-full">
                    Alert Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Manage security policies, authentication, and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure authentication policies and requirements
                  </p>
                  <Button variant="outline" className="w-full">
                    Auth Settings
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Access Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage access control and permission policies
                  </p>
                  <Button variant="outline" className="w-full">
                    Access Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General System Configuration
              </CardTitle>
              <CardDescription>
                General system settings and application configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Application Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure general application settings
                  </p>
                  <Button variant="outline" className="w-full">
                    App Settings
                  </Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Maintenance</h4>
                  <p className="text-sm text-muted-foreground">
                    System maintenance and configuration tools
                  </p>
                  <Button variant="outline" className="w-full">
                    Maintenance Tools
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettingsPage;
