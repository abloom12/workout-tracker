import { useStore } from '@tanstack/react-form';

import { useFieldContext } from '@/lib/form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { NativeSelect, NativeSelectOption } from '../ui/native-select';

type SelectFieldProps = {
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  description?: string;
};

export function NativeSelectField({
  label,
  options,
  placeholder,
  description,
}: SelectFieldProps) {
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
      <NativeSelect
        id={field.name}
        value={field.state.value}
        aria-invalid={hasErrors}
        aria-describedby={describedBy}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      >
        {placeholder && (
          <NativeSelectOption value="" aria-hidden="true" disabled>
            {placeholder}
          </NativeSelectOption>
        )}
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
      <FieldError id={errorId} errors={isTouched ? errors : undefined} />
    </Field>
  );
}
