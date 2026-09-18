import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { authClient } from '@/lib/auth-client';
import { authSearchSchema, getAuthRedirect } from '@/lib/auth-redirect';
import { useAppForm } from '@/lib/form';

export const Route = createFileRoute('/signup')({
  beforeLoad: async ({ search }) => {
    const { data: session } = await authClient.getSession();

    if (session) {
      throw redirect({ to: getAuthRedirect(search.redirect) });
    }
  },
  component: RouteComponent,
  validateSearch: authSearchSchema,
});

const signupSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters')
      .max(128, 'Password must be at most 128 characters'),
    confirm: z.string(),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type SignupSchema = z.infer<typeof signupSchema>;

function RouteComponent() {
  const navigate = useNavigate({ from: '/signup' });
  const { redirect: redirectTo } = Route.useSearch();

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm: '',
    } as SignupSchema,
    validators: { onChange: signupSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      await navigate({ to: getAuthRedirect(redirectTo) });
      toast.success('Account created successfully');
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="name"
                children={(field) => <field.InputField label="Name" />}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.InputField label="Email" type="email" />
                )}
              />
              <form.AppField
                name="password"
                children={(field) => <field.PasswordField label="Password" />}
              />
              <form.AppField
                name="confirm"
                children={(field) => (
                  <field.PasswordField label="Confirm Password" />
                )}
              />

              <form.AppForm>
                <Field>
                  <form.SubmitButton label="Create Account" />
                </Field>
              </form.AppForm>
            </FieldGroup>
          </form>

          <div className="flex items-center justify-center">
            <p>Already have an account?</p>
            <Button asChild variant="link">
              <Link
                to="/login"
                search={redirectTo ? { redirect: redirectTo } : {}}
              >
                Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
