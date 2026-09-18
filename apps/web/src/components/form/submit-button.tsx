import { useFormContext } from '@/lib/form';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

export function SubmitButton({
  label,
  loadingLabel,
}: {
  label: string;
  loadingLabel?: string;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" aria-busy={isSubmitting} disabled={!canSubmit}>
          {isSubmitting && <Spinner className="size-4" />}
          {isSubmitting ? (loadingLabel ?? label) : label}
        </Button>
      )}
    </form.Subscribe>
  );
}
