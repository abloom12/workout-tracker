# Field

Source: [`field.tsx`](../../src/components/ui/field.tsx). Unlisted props are forwarded to the corresponding HTML element; all pieces accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `Field` | `orientation`: `vertical` (default), `horizontal`, `responsive`; `data-invalid`, `data-disabled` for state styling (supply them where appropriate). |
| `FieldLabel` | HTML `label` props, especially `htmlFor` for a separate control. Can also wrap nested controls. |
| `FieldGroup` | Standard `div` props; stacks related fields. |
| `FieldContent` | Standard `div` props; groups title/description beside a control in horizontal layouts. |
| `FieldTitle` | Standard `div` props; non-label title text. |
| `FieldDescription` | Standard `p` props; helper text. |
| `FieldError` | `errors?: ({ message: string } \| undefined)[]`, or `children` to override the rendered messages. Deduplicates errors; renders nothing when empty. |
| `FieldSet` | HTML `fieldset` props, including `disabled`. |
| `FieldLegend` | `variant`: `legend` (default) or `label`; HTML `legend` props. |
| `FieldSeparator` | `children` for an optional centered label; standard `div` props. |

## Structure

```text
Field
├── FieldLabel
├── your control (Input, Select, Checkbox, etc.)
├── FieldDescription (optional)
└── FieldError (optional)

Field orientation="horizontal" (alternative layout)
├── your control
├── FieldContent
│   ├── FieldTitle / FieldLabel
│   └── FieldDescription (optional)
└── FieldError (optional)

FieldGroup
├── Field (repeat)
└── FieldSeparator (optional, between fields/sections)

FieldSet
├── FieldLegend
├── FieldDescription (optional)
└── FieldGroup (or individual Field children)
```

`FieldTitle` is non-label text; prefer `FieldLabel` when the control needs a label. Associate labels, descriptions, and errors with controls using `htmlFor`, `id`, and `aria-describedby` as appropriate.
