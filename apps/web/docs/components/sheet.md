# Sheet

Source: [`sheet.tsx`](../../src/components/ui/sheet.tsx). Unlisted props are forwarded to the corresponding Radix Dialog primitive or HTML element; styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `Sheet` | `open`, `defaultOpen`, `onOpenChange`, `modal`. |
| `SheetTrigger`, `SheetClose` | `asChild` to use your own trigger/close element. |
| `SheetContent` | `side`: `right` (default), `left`, `top`, `bottom`; `showCloseButton`: `true` (default) or `false`; Radix dialog content props such as `onEscapeKeyDown`, `onInteractOutside`. Automatically renders portal and overlay. |
| `SheetHeader`, `SheetFooter` | Standard `div` props; layout slots. |
| `SheetTitle`, `SheetDescription` | Radix title/description props; provide accessible heading and description. |

## Structure

```text
Sheet
├── SheetTrigger
└── SheetContent (creates internal SheetPortal + SheetOverlay)
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription (optional)
    ├── your content
    └── SheetFooter (optional)
        └── SheetClose (optional)
```

`SheetContent` adds a close button by default. `SheetPortal` and `SheetOverlay` are internal helpers in this repo, **not exports**; do not import them. `SheetClose` can wrap a custom button with `asChild`.
