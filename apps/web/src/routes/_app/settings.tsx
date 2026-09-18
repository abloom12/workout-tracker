import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import type { Session, User } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { useAppForm } from '@/lib/form';

export const Route = createFileRoute('/_app/settings')({
  component: RouteComponent,
});

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  image: z.union([z.literal(''), z.url('Enter a valid image URL')]),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(12, 'Password must be at least 12 characters')
      .max(128, 'Password must be at most 128 characters'),
    confirmPassword: z.string(),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    { message: 'Passwords do not match', path: ['confirmPassword'] },
  );

type AuthSession = { session: Session; user: User };
type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

function RouteComponent() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return <main className="p-4">Loading settings…</main>;
  }

  return <SettingsContent session={session} />;
}

function SettingsContent({ session }: { session: AuthSession }) {
  const navigate = useNavigate({ from: '/settings' });

  const profileForm = useAppForm({
    defaultValues: {
      name: session.user.name,
      image: session.user.image ?? '',
    } as ProfileValues,
    validators: { onChange: profileSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.updateUser({
        name: value.name.trim(),
        image: value.image || null,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Profile updated');
    },
  });

  const passwordForm = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    } as PasswordValues,
    validators: { onChange: passwordSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: false,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      passwordForm.reset();
      toast.success('Password updated');
    },
  });

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    await navigate({ to: '/' });
    toast.success('Signed out successfully');
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">Manage your account.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your current account details.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar size="lg">
            {session.user.image && (
              <AvatarImage src={session.user.image} alt={session.user.name} />
            )}
            <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{session.user.name}</p>
            <p className="text-muted-foreground truncate">
              {session.user.email}
            </p>
            <Badge variant={session.user.emailVerified ? 'default' : 'outline'}>
              {session.user.emailVerified ?
                'Email verified'
              : 'Email unverified'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update the information shown on your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void profileForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <profileForm.AppField
                name="name"
                children={(field) => <field.InputField label="Name" />}
              />
              <profileForm.AppField
                name="image"
                children={(field) => (
                  <field.InputField
                    label="Profile Image URL"
                    type="url"
                    description="Leave blank to remove your profile image."
                  />
                )}
              />
              <profileForm.AppForm>
                <Field>
                  <profileForm.SubmitButton label="Save Profile" />
                </Field>
              </profileForm.AppForm>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Enter your current password to choose a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void passwordForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <passwordForm.AppField
                name="currentPassword"
                children={(field) => (
                  <field.PasswordField label="Current Password" />
                )}
              />
              <passwordForm.AppField
                name="newPassword"
                children={(field) => (
                  <field.PasswordField
                    label="New Password"
                    description="Use 12 to 128 characters."
                  />
                )}
              />
              <passwordForm.AppField
                name="confirmPassword"
                children={(field) => (
                  <field.PasswordField label="Confirm New Password" />
                )}
              />
              <passwordForm.AppForm>
                <Field>
                  <passwordForm.SubmitButton label="Update Password" />
                </Field>
              </passwordForm.AppForm>
            </FieldGroup>
          </form>

          <Separator className="my-6" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">Sign out</p>
              <p className="text-muted-foreground">
                End the current browser session.
              </p>
            </div>
            <Button variant="outline" onClick={() => void handleSignOut()}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Session</CardTitle>
          <CardDescription>Details for this signed-in session.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd>{formatDate(session.session.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Expires</dt>
              <dd>{formatDate(session.session.expiresAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </main>
  );
}

function formatDate(value: Date) {
  return value.toLocaleString();
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
