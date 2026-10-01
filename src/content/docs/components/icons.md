---
title: "Icons"
description: Custom Lucide-compatible icons converted from Figma, social brand marks, and the Ozeaon logo and wordmark SVGs.
---

`src/components/icons/` holds the SVG icons that Lucide doesn't provide. There's no barrel file, so import each icon from its own module (e.g. `@/components/icons/CustomIcons`). All of them are plain modules, safe in server and client components.

## CustomIcons

Figma icons wrapped with Lucide's `createLucideIcon`. They behave exactly like `lucide-react` icons, so you can pass them anywhere a Lucide component is expected: `Button`'s `iconLeft`/`iconRight`, nav config `icon` fields, and so on.

Gotchas:

- Figma draws on a 16 or 20 px grid, but Lucide uses a 24 px viewBox. Each path therefore carries its own scale transform and a reduced stroke width.
- Some paths are filled shapes, so a `strokeWidth` prop changes only the stroked parts.

```tsx
<Button variant="icon" size="auto" iconLeft={CommentLightIcon} iconLeftSize={20}>
  {formatCompactCount(count)}
</Button>
```

**Source:** [src/components/icons/CustomIcons.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/CustomIcons.tsx)

## GithubIcon

GitHub's mark. It takes `LucideProps`, but the fill is hard-coded, so `className` text colours don't recolour it.

**Source:** [src/components/icons/Github.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/Github.tsx)

## LinkedIn

LinkedIn's "in" glyph on its brand-blue tile. It takes `LucideProps`, and both fills are hard-coded.

**Source:** [src/components/icons/LinkedIn.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/LinkedIn.tsx)

## OzeaonLogo

The Ozeaon logo mark. It takes `SVGProps`. A `className` you pass **replaces** the default `fill-primary` rather than merging with it, so include a fill class if you need one.

**Source:** [src/components/icons/Logo.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/Logo.tsx)

## SiteTitle

The "Ozeaon" wordmark, usually paired with `OzeaonLogo`. As with the logo, a passed `className` replaces the default `fill-primary`.

**Source:** [src/components/icons/SiteTitle.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/SiteTitle.tsx)
