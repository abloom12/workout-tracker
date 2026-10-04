# Item

Source: [`item.tsx`](../../src/components/ui/item.tsx). Unlisted props are forwarded to the corresponding HTML element (or `Separator`); styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `ItemGroup` | Standard `div` props; renders `role="list"`. |
| `Item` | `variant`: `default` (default), `outline`, `muted`; `size`: `default` (default), `sm`, `xs`; `asChild`: `false` (default) or `true` to render its child (e.g. an anchor) instead of a `div`. |
| `ItemMedia` | `variant`: `default` (default), `icon`, `image`; standard `div` props. |
| `ItemContent`, `ItemHeader`, `ItemFooter`, `ItemActions`, `ItemTitle` | Standard `div` props. |
| `ItemDescription` | Standard `p` props. |
| `ItemSeparator` | Forwards `Separator` props, including `decorative`; orientation is set to `horizontal` by this wrapper. |

## Structure

```text
ItemGroup (optional for a collection)
├── Item
│   ├── ItemHeader (optional)
│   ├── ItemMedia (optional)
│   ├── ItemContent
│   │   ├── ItemTitle
│   │   └── ItemDescription (optional)
│   ├── ItemActions (optional)
│   └── ItemFooter (optional)
├── ItemSeparator (optional, between items)
└── Item (repeat as needed)
```

A standalone `Item` does not need an `ItemGroup`. `ItemTitle` is a styled `div`, not a heading element.
