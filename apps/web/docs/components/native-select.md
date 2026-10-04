# Native Select

Source: [`native-select.tsx`](../../src/components/ui/native-select.tsx). These are styled native HTML controls, **not** Radix Select. Unlisted props are standard `select`, `option`, or `optgroup` props.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `NativeSelect` | `size`: `default` (default) or `sm` (replaces the native numeric `select.size` prop); `value`/`defaultValue`, `onChange`, `name`, `disabled`, `required`. `className` styles the **outer wrapper**, not the inner `select`. |
| `NativeSelectOption` | `value`, `disabled`, `label`, `children`, `className` (HTML `option` props). |
| `NativeSelectOptGroup` | `label` (required by HTML), `disabled`, `children`, `className` (HTML `optgroup` props). |

## Structure

```text
NativeSelect (renders a select inside a styled wrapper)
├── NativeSelectOption (repeat as needed)
└── NativeSelectOptGroup (optional; repeat as needed)
    └── NativeSelectOption (repeat as needed)
```

Options may be directly under `NativeSelect`, inside groups, or both. For the Radix-based custom select, see [Select](./select.md).
