# Alert Dialog

Source: [`alert-dialog.tsx`](../../src/components/ui/alert-dialog.tsx). Props not listed below are forwarded to the corresponding Radix primitive (or HTML element); `className` is available on styled parts.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `AlertDialog` | `open`, `defaultOpen`, `onOpenChange` for controlled/uncontrolled state. |
| `AlertDialogTrigger` | `asChild` to use your own trigger element. |
| `AlertDialogContent` | `size`: `default` (default) or `sm`; Radix content event handlers such as `onEscapeKeyDown`. Automatically renders a portal and overlay. |
| `AlertDialogAction` | `variant`: `default` (default), `secondary`, `destructive`, `outline`, `ghost`, `link`; `size`: `default` (default), `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`. Closes the dialog. |
| `AlertDialogCancel` | Same button `variant` options (default `outline`) and `size` options (default `default`). Closes the dialog. |
| `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogMedia` | Standard `div` props. |
| `AlertDialogTitle`, `AlertDialogDescription` | Radix title/description props; provide accessible heading and explanation. |
| `AlertDialogPortal` | Radix portal props such as `container`, `forceMount`. Usually unnecessary: `AlertDialogContent` creates one. |
| `AlertDialogOverlay` | Radix overlay props such as `forceMount`. Usually unnecessary: `AlertDialogContent` creates one. |

## Structure

```text
AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent (creates AlertDialogPortal + AlertDialogOverlay)
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia (optional)
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction
```

Put the operation being confirmed in `AlertDialogAction`; use `AlertDialogCancel` for the escape route. Header, media, description, and footer are layout choices; include a title for accessibility.
