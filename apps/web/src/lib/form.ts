import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import { CheckboxField } from '@/components/form/checkbox-field';
import { CurrencyField } from '@/components/form/currency-field';
import { InputField } from '@/components/form/input-field';
import { NativeSelectField } from '@/components/form/native-select-field';
import { PasswordField } from '@/components/form/password-field';
import { SelectField } from '@/components/form/select-field';
import { SubmitButton } from '@/components/form/submit-button';
import { TextareaField } from '@/components/form/textarea-field';

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    CheckboxField,
    InputField,
    PasswordField,
    SelectField,
    NativeSelectField,
    TextareaField,
    CurrencyField,
  },
  formComponents: { SubmitButton },
  fieldContext,
  formContext,
});
