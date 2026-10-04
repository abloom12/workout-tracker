# Avatar

Source: [`avatar.tsx`](../../src/components/ui/avatar.tsx). Unlisted props are forwarded to the corresponding Radix primitive or HTML element; styled parts accept `className`.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `Avatar` | `size`: `default` (default), `sm`, `lg`. Radix `asChild`. |
| `AvatarImage` | `src`, `alt`, `onLoadingStatusChange` and image props. |
| `AvatarFallback` | `delayMs` to delay fallback rendering; children are fallback text/icon. |
| `AvatarBadge` | Standard `span` props; content such as a status dot/icon. |
| `AvatarGroup` | Standard `div` props; wraps multiple avatars. |
| `AvatarGroupCount` | Standard `div` props; displays remaining count. |

## Structure

```text
Avatar
├── AvatarImage
├── AvatarFallback
└── AvatarBadge (optional)

AvatarGroup (optional, for a stack)
├── Avatar
│   ├── AvatarImage
│   └── AvatarFallback
├── Avatar (repeat as needed)
└── AvatarGroupCount (optional)
```

Use `AvatarFallback` when the image has not loaded or fails; provide useful `alt` text on the image.
