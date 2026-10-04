# Tabs

Source: [`tabs.tsx`](../../src/components/ui/tabs.tsx). Unlisted props are forwarded to the corresponding Radix Tabs primitive; all parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `Tabs` | `defaultValue` for uncontrolled tabs or `value` + `onValueChange` for controlled tabs; `orientation`: `horizontal` (default) or `vertical`; `dir`, `activationMode`: `automatic` or `manual`. |
| `TabsList` | `variant`: `default` (default) or `line`; `loop` for keyboard wrapping. |
| `TabsTrigger` | `value` (required), `disabled`; use one per tab. |
| `TabsContent` | `value` (required), `forceMount` to keep an inactive panel mounted. |

## Structure

```text
Tabs (defaultValue or value)
├── TabsList (variant)
│   ├── TabsTrigger value="first"
│   └── TabsTrigger value="second"
├── TabsContent value="first"
└── TabsContent value="second"
```

Each trigger and its corresponding content must share the same `value`. `TabsContent` is a sibling of `TabsList`, not nested inside it. For vertical tabs use `orientation="vertical"` on `Tabs`; for underline tabs use `variant="line"` on `TabsList`.
