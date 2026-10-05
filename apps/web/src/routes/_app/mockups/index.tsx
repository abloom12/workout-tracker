import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/mockups/')({
  beforeLoad: () => {
    throw redirect({ to: '/mockups/mockup', replace: true });
  },
});
