# Web Coding Standards

- Before using a plain HTML element for UI, check `src/components/` for an existing component that fits.
- Prefer TypeScript `type` over `interface`. If an interface is necessary, add a comment explaining why.
- Keep UI components small. Extract distinct sections into components in the same file; move them out only when clearly reusable.
