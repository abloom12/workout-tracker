import { useStore } from '@tanstack/react-form';
import { DollarSign } from 'lucide-react';

import { useFieldContext } from '@/lib/form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '../ui/input-group';

export function CurrencyField({
  label,
  description,
}: {
  label: string;
  description?: string;
}) {
  const field = useFieldContext<string>();
  const { errors, isTouched } = useStore(field.store, (state) => state.meta);

  const descriptionId = `${field.name}-description`;
  const errorId = `${field.name}-error`;
  const hasErrors = isTouched && errors.length > 0;

  const describedBy =
    `${description ? descriptionId : ''} ${hasErrors ? errorId : ''}`.trim() ||
    undefined;

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          type="string"
          id={field.name}
          value={field.state.value}
          placeholder="0.00"
          aria-invalid={hasErrors}
          aria-describedby={describedBy}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
      <FieldError id={errorId} errors={isTouched ? errors : undefined} />
    </Field>
  );
}
