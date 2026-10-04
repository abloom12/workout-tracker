# Sidebar

Source: [`sidebar.tsx`](../../src/components/ui/sidebar.tsx). Unlisted props are forwarded to the indicated HTML element or local UI component; styled parts accept `className`. Many helpers are layout slots, not independently interactive widgets.

## Props at a glance

| Component | Useful props and options |
| --- | --- |
| `SidebarProvider` | `defaultOpen`: `true` (default), or controlled `open` + `onOpenChange(open: boolean)`. Also accepts `style` for wrapper styles/CSS variables. Provides sidebar state to descendants. |
| `Sidebar` | `side`: `left` (default), `right`; `variant`: `sidebar` (default), `floating`, `inset`; `collapsible`: `offcanvas` (default), `icon`, `none`. Uses a Sheet on mobile unless `collapsible="none"`. |
| `SidebarTrigger` | Local `Button` props such as `variant`, `size`, `asChild`, `onClick`; renders an icon button and calls `toggleSidebar` after `onClick`. Styled by default as `ghost`, `icon-sm`. |
| `SidebarRail` | Standard `button` props; edge control to toggle the sidebar. |
| `SidebarInset` | Standard `main` props; main page area alongside an inset sidebar. |
| `SidebarHeader`, `SidebarContent`, `SidebarFooter` | Standard `div` props; top, scrollable middle, and bottom areas. |
| `SidebarInput` | Local `Input` / HTML `input` props (`placeholder`, `value`, `onChange`, etc.). |
| `SidebarSeparator` | Local `Separator` props including `orientation` and `decorative`. |
| `SidebarGroup` | Standard `div` props; section within `SidebarContent`. |
| `SidebarGroupLabel` | `asChild`: `false` (default) or `true`; otherwise standard `div` props. |
| `SidebarGroupAction` | `asChild`: `false` (default) or `true`; otherwise standard `button` props. |
| `SidebarGroupContent` | Standard `div` props; contains the group's menu or other content. |
| `SidebarMenu` | Standard `ul` props; contains menu items. |
| `SidebarMenuItem` | Standard `li` props; wrap a menu button and optional action/badge/submenu. |
| `SidebarMenuButton` | `variant`: `default` (default), `outline`; `size`: `default` (default), `sm`, `lg`; `isActive`: `false` (default); `asChild`: `false` (default) or `true` to use a child link. Otherwise HTML `button` props. |
| `SidebarMenuAction` | `showOnHover`: `false` (default) or `true`; `asChild`: `false` (default) or `true`; otherwise HTML `button` props. |
| `SidebarMenuBadge` | Standard `div` props; usually a count/status. |
| `SidebarMenuSub` | Standard `ul` props; subnavigation list. |
| `SidebarMenuSubItem` | Standard `li` props; contains `SidebarMenuSubButton`. |
| `SidebarMenuSubButton` | `size`: `md` (default) or `sm`; `isActive`: `false` (default); `asChild`: `false` (default) or `true` to use a child link. Otherwise HTML `a` props; provide `href` when rendering an anchor. |

## Structure

```text
SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   │   └── SidebarInput / other header content (optional)
│   ├── SidebarContent
│   │   ├── SidebarGroup (repeat as needed)
│   │   │   ├── SidebarGroupLabel (optional)
│   │   │   ├── SidebarGroupAction (optional)
│   │   │   └── SidebarGroupContent (optional)
│   │   │       └── SidebarMenu
│   │   │           └── SidebarMenuItem (repeat)
│   │   │               ├── SidebarMenuButton
│   │   │               ├── SidebarMenuAction (optional)
│   │   │               ├── SidebarMenuBadge (optional)
│   │   │               └── SidebarMenuSub (optional)
│   │   │                   └── SidebarMenuSubItem (repeat)
│   │   │                       └── SidebarMenuSubButton
│   │   └── SidebarSeparator (optional, between groups)
│   ├── SidebarFooter (optional)
│   └── SidebarRail (optional)
├── SidebarInset (optional; page main area)
└── SidebarTrigger (place where the toggle should appear)
```

`SidebarTrigger` can live elsewhere under `SidebarProvider` (for example, inside a page header), not necessarily as the final sibling. For navigational items, use `asChild` with a router link in `SidebarMenuButton` or `SidebarMenuSubButton`; keep `SidebarMenuAction` for a separate action. `SidebarMenu` can be a direct child of `SidebarGroup` without `SidebarGroupContent`.
