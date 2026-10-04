# Dropdown Menu

Source: [`dropdown-menu.tsx`](../../src/components/ui/dropdown-menu.tsx). Unlisted props are forwarded to the corresponding Radix primitive or HTML element; styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `DropdownMenu` | `open`, `defaultOpen`, `onOpenChange`, `modal`, `dir`. |
| `DropdownMenuTrigger` | `asChild`, `disabled`; wrap a button or other trigger. |
| `DropdownMenuContent` | `align`: `start` (default), `center`, `end`; `side`: `top`, `right`, `bottom`, `left`; `sideOffset`: `4` (default); `alignOffset`, `collisionPadding`. Creates its own portal. |
| `DropdownMenuItem` | `variant`: `default` (default) or `destructive`; `inset?: boolean`; `disabled`, `onSelect`. |
| `DropdownMenuCheckboxItem` | `checked`, `onCheckedChange`, `inset?: boolean`, `disabled`, `onSelect`. |
| `DropdownMenuRadioGroup` | `value`, `onValueChange`; contains radio items. |
| `DropdownMenuRadioItem` | `value` (required), `inset?: boolean`, `disabled`, `onSelect`. |
| `DropdownMenuSub` | `open`, `defaultOpen`, `onOpenChange`. |
| `DropdownMenuSubTrigger` | `inset?: boolean`, `disabled`. |
| `DropdownMenuSubContent` | Radix submenu content positioning/event props. |
| `DropdownMenuLabel` | `inset?: boolean`. |
| `DropdownMenuGroup`, `DropdownMenuSeparator` | Radix group/separator props. |
| `DropdownMenuShortcut` | Standard `span` props; visual shortcut hint only (does not bind a key). |
| `DropdownMenuPortal` | `container`, `forceMount`; usually unnecessary because `DropdownMenuContent` creates one. |

## Structure

```text
DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent (creates DropdownMenuPortal)
    ├── DropdownMenuGroup (optional)
    │   ├── DropdownMenuLabel (optional)
    │   ├── DropdownMenuItem (repeat as needed)
    │   │   └── DropdownMenuShortcut (optional)
    │   └── DropdownMenuCheckboxItem (optional)
    ├── DropdownMenuSeparator (optional)
    ├── DropdownMenuRadioGroup (optional)
    │   └── DropdownMenuRadioItem (repeat as needed)
    └── DropdownMenuSub (optional)
        ├── DropdownMenuSubTrigger
        └── DropdownMenuSubContent
            └── DropdownMenuItem / DropdownMenuGroup / other menu entries
```

Items and labels can also go directly in `DropdownMenuContent` or `DropdownMenuSubContent`; groups are optional.
