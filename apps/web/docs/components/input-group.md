# Input Group

Source: [`input-group.tsx`](../../src/components/ui/input-group.tsx). Unlisted props are forwarded to the corresponding HTML element or local `Button`/`Input`/`Textarea`; styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `InputGroup` | Standard `div` props; container for a control and its addons. |
| `InputGroupAddon` | `align`: `inline-start` (default), `inline-end`, `block-start`, `block-end`; `onClick` and other `div` props. Clicking non-button addon content focuses the first input by default. |
| `InputGroupInput` | HTML `input` props such as `type`, `placeholder`, `value`, `onChange`, `disabled`, `aria-invalid`. |
| `InputGroupTextarea` | HTML `textarea` props such as `rows`, `placeholder`, `value`, `onChange`, `disabled`. |
| `InputGroupButton` | `size`: `xs` (default), `sm`, `icon-xs`, `icon-sm`; `variant`: `ghost` (default), `default`, `secondary`, `destructive`, `outline`, `link`; `type`: `button` (default). Other local `Button` props, including `asChild`. |
| `InputGroupText` | Standard `span` props; noninteractive addon text. |

## Structure

```text
InputGroup
├── InputGroupAddon align="inline-start" (optional)
│   └── InputGroupText / InputGroupButton / icon
├── InputGroupInput OR InputGroupTextarea
└── InputGroupAddon align="inline-end" (optional)
    └── InputGroupButton / InputGroupText / icon
```

Block addons use `align="block-start"` or `align="block-end"`. Put `InputGroupButton` and `InputGroupText` **inside** an `InputGroupAddon`, not as its siblings; use a real label for the input separately.
