# Select

Source: [`select.tsx`](../../src/components/ui/select.tsx). This is the Radix-based custom select; for an HTML select see [Native Select](./native-select.md). Unlisted props are forwarded to the corresponding Radix primitive; styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `Select` | `value`/`defaultValue`, `onValueChange`, `name`, `disabled`, `required`, `open`/`defaultOpen`, `onOpenChange`, `dir`. |
| `SelectTrigger` | `size`: `default` (default) or `sm`; `disabled`, `aria-label`; includes a chevron automatically. |
| `SelectValue` | `placeholder` for the empty state; displays the chosen item. |
| `SelectContent` | `position`: `item-aligned` (default) or `popper`; `align`: `center` (default), `start`, `end`; `side`: `top`, `right`, `bottom`, `left`; `sideOffset`. Automatically renders a portal, viewport, and scroll buttons. |
| `SelectGroup` | Group props; groups options and an optional label. |
| `SelectLabel` | Group heading text. |
| `SelectItem` | `value` (required, non-empty), `disabled`, `textValue` (for typeahead when needed). Automatically renders item text and selected indicator. |
| `SelectSeparator` | Radix separator props; divides groups. |
| `SelectScrollUpButton`, `SelectScrollDownButton` | Radix scroll-button props; normally **do not add manually** since `SelectContent` includes them. |

## Structure

```text
Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent (creates portal + viewport + scroll buttons)
    ├── SelectGroup (optional)
    │   ├── SelectLabel (optional)
    │   └── SelectItem (repeat as needed)
    ├── SelectSeparator (optional)
    └── SelectItem / SelectGroup (repeat as needed)
```

`SelectItem` may be directly in `SelectContent`; groups are optional. Give every item a distinct `value`. No need to nest `SelectItemText` or a portal yourself: this wrapper supplies them.
