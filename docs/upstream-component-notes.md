# Upstream Component Notes

## shadcn `useIsMobile`

`apps/web/src/hooks/use-mobile.ts` originated from shadcn/ui and remains aligned with the current upstream implementation.

The hook intentionally initializes viewport state after mount. React's `react-hooks/set-state-in-effect` rule reports that initialization because it synchronously updates state inside an effect. The project uses a focused ESLint suppression for this line rather than rewriting the hook and diverging from upstream solely to satisfy lint.

Upstream references:

- [shadcn registry entry](https://ui.shadcn.com/r/styles/new-york-v4/use-mobile.json)
- [shadcn source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/hooks/use-mobile.ts)

Revisit this decision when any of the following occurs:

- shadcn changes the upstream hook implementation;
- React or `eslint-plugin-react-hooks` changes its guidance for media-query subscriptions;
- the web application adopts server rendering or hydration; or
- viewport behavior exposes a correctness or performance problem.
