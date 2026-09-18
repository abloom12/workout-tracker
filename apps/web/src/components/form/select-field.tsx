import { useStore } from '@tanstack/react-form';

import { useFieldContext } from '@/lib/form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type SelectFieldProps = {
  label: string;
  options: Array<{ value: string; label: string }>;
  groupLabel?: string;
  placeholder?: string;
  description?: string;
};

export function SelectField({
  label,
  options,
  placeholder,
  description,
  groupLabel,
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
      <Select
        value={field.state.value}
        name={field.name}
        aria-invalid={hasErrors}
        aria-describedby={describedBy}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>{groupLabel}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}

      <FieldError id={errorId} errors={isTouched ? errors : undefined} />
    </Field>
  );
}
