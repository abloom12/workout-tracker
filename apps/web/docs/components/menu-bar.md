# Menubar

Source: [`menu-bar.tsx`](../../src/components/ui/menu-bar.tsx). Unlisted props are forwarded to the corresponding Radix primitive or HTML element; styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `Menubar` | `value`, `defaultValue`, `onValueChange`, `dir`, `loop` for active-menu state and keyboard navigation. |
| `MenubarMenu` | `value` to identify a menu; contains trigger and content. |
| `MenubarTrigger` | `disabled` and Radix trigger props. |
| `MenubarContent` | `align`: `start` (default), `center`, `end`; `alignOffset`: `-4` (default); `sideOffset`: `8` (default); `side`, `collisionPadding`. Creates its own portal. |
| `MenubarItem` | `variant`: `default` (default) or `destructive`; `inset?: boolean`; `disabled`, `onSelect`. |
| `MenubarCheckboxItem` | `checked`, `onCheckedChange`, `inset?: boolean`, `disabled`, `onSelect`. |
| `MenubarRadioGroup` | `value`, `onValueChange`; contains radio items. |
| `MenubarRadioItem` | `value` (required), `inset?: boolean`, `disabled`, `onSelect`. |
| `MenubarSub` | `open`, `defaultOpen`, `onOpenChange`. |
| `MenubarSubTrigger` | `inset?: boolean`, `disabled`. |
| `MenubarSubContent` | Radix submenu content positioning/event props. |
| `MenubarLabel` | `inset?: boolean`. |
| `MenubarGroup`, `MenubarSeparator` | Radix group/separator props. |
| `MenubarShortcut` | Standard `span` props; visual shortcut hint only (does not bind a key). |
| `MenubarPortal` | `container`, `forceMount`; usually unnecessary because `MenubarContent` creates one. |

## Structure

```text
Menubar
├── MenubarMenu
│   ├── MenubarTrigger
│   └── MenubarContent (creates MenubarPortal)
│       ├── MenubarGroup (optional)
│       │   ├── MenubarLabel (optional)
│       │   ├── MenubarItem (repeat as needed)
│       │   │   └── MenubarShortcut (optional)
│       │   └── MenubarCheckboxItem (optional)
│       ├── MenubarSeparator (optional)
│       ├── MenubarRadioGroup (optional)
│       │   └── MenubarRadioItem (repeat as needed)
│       └── MenubarSub (optional)
│           ├── MenubarSubTrigger
│           └── MenubarSubContent
│               └── MenubarItem / MenubarGroup / other menu entries
└── MenubarMenu (repeat for each top-level menu)
```

Items and labels can also go directly in `MenubarContent` or `MenubarSubContent`; groups are optional.
