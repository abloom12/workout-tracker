# Context Menu

Source: [`context-menu.tsx`](../../src/components/ui/context-menu.tsx). Unlisted props are forwarded to the corresponding Radix primitive (or HTML element); styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `ContextMenu` | `modal`, `dir`, `onOpenChange` (Radix root props). |
| `ContextMenuTrigger` | `asChild`, `disabled`; wrap the area that responds to the context-menu gesture. |
| `ContextMenuContent` | `collisionPadding` and other supported Radix content props. The local wrapper declares `side?: 'top' \| 'right' \| 'bottom' \| 'left'`, but Radix Context Menu omits positioning props (`side`, `sideOffset`, `align`); don't rely on `side` for placement. Creates its own portal. |
| `ContextMenuItem` | `variant`: `default` (default) or `destructive`; `inset?: boolean`; `disabled`, `onSelect`. |
| `ContextMenuCheckboxItem` | `checked`, `onCheckedChange`, `inset?: boolean`, `disabled`, `onSelect`. |
| `ContextMenuRadioGroup` | `value`, `onValueChange`; contains radio items. |
| `ContextMenuRadioItem` | `value` (required), `inset?: boolean`, `disabled`, `onSelect`. |
| `ContextMenuSub` | `open`, `defaultOpen`, `onOpenChange`. |
| `ContextMenuSubTrigger` | `inset?: boolean`, `disabled`. |
| `ContextMenuSubContent` | Radix submenu content positioning/event props. |
| `ContextMenuLabel` | `inset?: boolean`. |
| `ContextMenuGroup`, `ContextMenuSeparator` | Radix group/separator props; group items or divide sections. |
| `ContextMenuShortcut` | Standard `span` props; visual shortcut hint only (does not bind a key). |
| `ContextMenuPortal` | `container`, `forceMount`; usually unnecessary because `ContextMenuContent` creates one. |

## Structure

```text
ContextMenu
├── ContextMenuTrigger
└── ContextMenuContent (creates ContextMenuPortal)
    ├── ContextMenuGroup (optional)
    │   ├── ContextMenuLabel (optional)
    │   ├── ContextMenuItem (repeat as needed)
    │   │   └── ContextMenuShortcut (optional)
    │   └── ContextMenuCheckboxItem (optional)
    ├── ContextMenuSeparator (optional)
    ├── ContextMenuRadioGroup (optional)
    │   └── ContextMenuRadioItem (repeat as needed)
    └── ContextMenuSub (optional)
        ├── ContextMenuSubTrigger
        └── ContextMenuSubContent
            └── ContextMenuItem / ContextMenuGroup / other menu entries
```

Items and labels can also go directly in `ContextMenuContent` or `ContextMenuSubContent`; groups are optional.
