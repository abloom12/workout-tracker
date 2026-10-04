# Button Group

Source: [`button-group.tsx`](../../src/components/ui/button-group.tsx). Unlisted props are forwarded to the underlying HTML element (or `Separator`); styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `ButtonGroup` | `orientation`: `horizontal` (style default) or `vertical`. Wrap related controls. |
| `ButtonGroupText` | `asChild`: `false` (default) or `true` to render its child instead of a `div`. |
| `ButtonGroupSeparator` | `orientation`: `vertical` (default) or `horizontal`; forwards other `Separator` props (`decorative` among them). |

## Structure

```text
ButtonGroup
├── Button / Input / SelectTrigger / another control
├── ButtonGroupSeparator (optional, between controls)
├── ButtonGroupText (optional, for a noninteractive label)
└── Button / another control
```

Nested `ButtonGroup`s are also supported; children are siblings, not wrapped in `ButtonGroupText` unless that text is the intended child.
