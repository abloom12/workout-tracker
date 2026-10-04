# Dialog

Source: [`dialog.tsx`](../../src/components/ui/dialog.tsx). Unlisted props are forwarded to the corresponding Radix primitive or HTML element; styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `Dialog` | `open`, `defaultOpen`, `onOpenChange`, `modal` for controlled/uncontrolled state and modality. |
| `DialogTrigger`, `DialogClose` | `asChild` to use your own trigger/close element. |
| `DialogContent` | `showCloseButton`: `true` (default) or `false`; Radix content props such as `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onInteractOutside`. Automatically adds portal and overlay. |
| `DialogHeader` | Standard `div` props. |
| `DialogFooter` | `showCloseButton`: `false` (default) or `true` to add a footer Close button; standard `div` props. |
| `DialogTitle`, `DialogDescription` | Radix title/description props; supply accessible heading and description. |
| `DialogPortal` | `container`, `forceMount`; usually unnecessary because `DialogContent` creates one. |
| `DialogOverlay` | Radix overlay props such as `forceMount`; usually unnecessary because `DialogContent` creates one. |

## Structure

```text
Dialog
├── DialogTrigger
└── DialogContent (creates DialogPortal + DialogOverlay)
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription (optional)
    ├── your content
    └── DialogFooter (optional)
        └── DialogClose (optional; or use showCloseButton on the footer)
```

`DialogContent` has its own close button by default; set `showCloseButton={false}` to omit it. `DialogClose` can wrap a custom button with `asChild`.
