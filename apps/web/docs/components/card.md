# Card

Source: [`card.tsx`](../../src/components/ui/card.tsx). All pieces forward standard `div` props, including `className` and `children`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `Card` | `size`: `default` (default) or `sm`; controls spacing of the card and its sections. |
| `CardHeader` | `className`; groups heading, description, and optional action. |
| `CardTitle`, `CardDescription` | `className`; text slots (both render `div`s, not heading/paragraph elements). |
| `CardAction` | `className`; aligns an action in the header. |
| `CardContent` | `className`; main content. |
| `CardFooter` | `className`; footer content. |

## Structure

```text
Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription (optional)
│   └── CardAction (optional)
├── CardContent
└── CardFooter (optional)
```

Use appropriate semantic elements inside the slots where needed (for example, an `h2` inside `CardTitle`).
