# Popover

Source: [`popover.tsx`](../../src/components/ui/popover.tsx). Unlisted props are forwarded to the corresponding Radix primitive or HTML element; styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `Popover` | `open`, `defaultOpen`, `onOpenChange`, `modal`. |
| `PopoverTrigger` | `asChild` to use your own trigger element. |
| `PopoverAnchor` | `asChild`; optional alternative anchor for positioning the popover. |
| `PopoverContent` | `align`: `center` (default), `start`, `end`; `side`: `top`, `right`, `bottom`, `left`; `sideOffset`: `4` (default); `alignOffset`, `collisionPadding`, outside-interaction handlers. Creates its own portal. |
| `PopoverHeader` | Standard `div` props; groups title and description. |
| `PopoverTitle` | Typed as `h2` props but actually renders a **`div`**; don't rely on it to create a semantic heading. |
| `PopoverDescription` | Standard `p` props. |

## Structure

```text
Popover
├── PopoverTrigger
├── PopoverAnchor (optional; sibling of the trigger)
└── PopoverContent (creates a Radix portal)
    ├── PopoverHeader (optional)
    │   ├── PopoverTitle
    │   └── PopoverDescription (optional)
    └── your content / actions
```

The header helpers are optional; put any interactive content inside `PopoverContent`.
