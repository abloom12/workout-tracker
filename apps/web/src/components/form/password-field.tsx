import type { ComponentProps } from 'react';
import { useState } from 'react';
import { useStore } from '@tanstack/react-form';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { useFieldContext } from '@/lib/form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group';

type PasswordFieldProps = {
  autoComplete?: ComponentProps<'input'>['autoComplete'];
  description?: string;
  label: string;
};

export function PasswordField({
  autoComplete,
  description,
  label,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

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
        <InputGroupInput
          type={showPassword ? 'text' : 'password'}
          id={field.name}
          value={field.state.value}
          name={field.name}
          autoComplete={autoComplete}
          aria-invalid={hasErrors}
          aria-describedby={describedBy}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
        <InputGroupAddon align="inline-end" className="cursor-pointer">
          <InputGroupButton
            aria-label={showPassword ? 'hide password' : 'show password'}
            size="icon-xs"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ?
              <EyeOffIcon />
            : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
      <FieldError id={errorId} errors={isTouched ? errors : undefined} />
    </Field>
  );
}
