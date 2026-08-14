import GenericPage from '@/components/GenericPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { user } = useAuth();

  const handleSave = () => toast.info('Settings are read-only in this preview.');

  return (
    <GenericPage title="Settings" subtitle="Account and workspace preferences.">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="kpi-card max-w-lg space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="settings-name">Full name</Label>
              <Input id="settings-name" defaultValue={user?.name ?? ''} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" defaultValue={user?.email ?? ''} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-phone">Phone</Label>
              <Input id="settings-phone" defaultValue={user?.phone ?? ''} disabled />
            </div>
            <Button onClick={handleSave}>Save changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="kpi-card max-w-lg space-y-3">
            <p className="text-sm text-muted-foreground">
              Notification preferences aren't configurable yet — this is a placeholder for a future release.
            </p>
            <Button variant="outline" onClick={handleSave}>Save changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="kpi-card max-w-lg space-y-3">
            <p className="text-sm text-muted-foreground">
              Password and security settings aren't configurable yet — this is a placeholder for a future release.
            </p>
            <Button variant="outline" onClick={handleSave}>Save changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </GenericPage>
  );
};

export default SettingsPage;
