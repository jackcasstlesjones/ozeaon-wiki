---
title: "Icons"
description: Custom Lucide-compatible icons converted from Figma, social brand marks, and the Ozeaon logo and wordmark SVGs.
sidebar:
  order: 7
---

`src/components/icons/` holds the SVG icons that Lucide doesn't provide. There are three groups:

- **`CustomIcons.tsx`:** Figma icons wrapped with Lucide's `createLucideIcon`. They behave exactly like `lucide-react` icons (`size`, `strokeWidth`, `className`, `currentColor`), so you can pass them anywhere a Lucide component is expected, including `Button`'s `iconLeft` / `iconRight` and nav config `icon` fields.
- **`Github.tsx`, `LinkedIn.tsx`:** brand marks drawn in their official fixed colours. They take `LucideProps`.
- **`Logo.tsx`, `SiteTitle.tsx`:** the Ozeaon mark and wordmark. They take `SVGProps<SVGSVGElement>` and default to `className="fill-primary"`.

There's no barrel file. Import each icon from its own module, for example `@/components/icons/CustomIcons`.

## CustomIcons

Eight Lucide icons built from Figma paths:

| Export | Lucide name | Used in |
|---|---|---|
| `EditLightIcon` | `edit-light` | `src/app/(main)/(feed)/(public)/articles/page.tsx`, `src/components/nav/DashboardSidebar.tsx`, `src/components/home/CreateFabMenu.tsx` |
| `ProjectSymlinkIcon` | `project-symlink` | `src/components/nav/DashboardSidebar.tsx`, `src/components/home/CreateFabMenu.tsx`, `src/components/posts/create-form/attachment-kinds.ts` |
| `RepostIcon` | `repost` | `src/components/posts/RepostButton.tsx` |
| `CommentLightIcon` | `comment-light` | `src/components/ui/comments/CommentToggle.tsx`, `src/components/articles/cards/MyArticleCard.tsx` |
| `GroupLightIcon` | `group-light` | `src/config/sitemap.tsx` |
| `PinAltLightIcon` | `pin-alt-light` | `src/components/users/UserGridCard.tsx` |
| `UserCircleCheckIcon` | `user-circle-check` | `src/components/users/UserGridCard.tsx` |
| `FullScreenIcon` | `full-screen` | `src/components/ui/display/PDFViewer/ViewerToolbar.tsx` |

- **Source:** [src/components/icons/CustomIcons.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/CustomIcons.tsx)
- **Kind:** No directive (plain module, safe in server and client components)

Props are Lucide's `LucideProps`.

Notable behaviour:

- Figma draws these icons on a 16 px or 20 px grid, but Lucide uses a 24 px viewBox. Each path therefore carries its own `transform` (for example `scale(1.2)`, `scale(1.5)`, or `scale(1.4) translate(1,2)`) and a reduced `strokeWidth`. Two shared presets are used: `FIGMA_16` (`scale(1.5) translate(-12, -4)`, for icons exported off-origin) and `FIGMA_16_ORIGIN` (`scale(1.5)`).
- Some paths are filled shapes (`fill: "currentColor"`, `strokeWidth: "0"`) rather than strokes. On those, a `strokeWidth` prop changes only the stroked parts of the icon.

```tsx
<RepostIcon size={20} strokeWidth={1} />

<Button variant="icon" size="auto" iconLeft={CommentLightIcon} iconLeftSize={20} iconRight={ChevronDown}>
  {formatCompactCount(count)}
</Button>

{ title: "Network", url: "/network", icon: GroupLightIcon }
```

## GithubIcon

GitHub's mark drawn in black (`#000`) on a 17 × 17 viewBox.

- **Source:** [src/components/icons/Github.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/Github.tsx)
- **Kind:** No directive
- **Used in:** `src/components/profiles/users/ProfileDataSlot.tsx`, `src/components/profiles/organizations/SocialLinkIcon.tsx`, `src/components/account/ProfileSettings.tsx`

Accepts `LucideProps`, which are spread onto the `<svg>`. The path fill is hard-coded, so `className` text colours don't recolour it.

```tsx
<GithubIcon className="size-5 text-muted hover:text-primary transition-colors" />
```

## LinkedIn

LinkedIn's white "in" glyph on its `#0A66C2` tile, on a 20 × 20 viewBox.

- **Source:** [src/components/icons/LinkedIn.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/LinkedIn.tsx)
- **Kind:** No directive
- **Used in:** `src/components/profiles/users/ProfileDataSlot.tsx`, `src/components/profiles/organizations/OrganizationLinks.tsx`, `src/components/organizations/form/steps/LinksStep.tsx`

Accepts `LucideProps`, which are spread onto the `<svg>`. Both fills are hard-coded.

```tsx
<LinkedIn className="size-5 text-muted hover:text-primary transition-colors" />
```

## OzeaonLogo

The Ozeaon logo mark. It defaults to 20 × 28 with `viewBox="8 3 32 43"`.

- **Source:** [src/components/icons/Logo.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/Logo.tsx)
- **Kind:** No directive
- **Used in:** `src/components/nav/TopNav.tsx`, `src/components/nav/MegaMenu.tsx`, `src/components/auth/AuthHeader.tsx`

Accepts `SVGProps<SVGSVGElement>`, which are spread after the defaults. A `className` you pass **replaces** the default `fill-primary`, it doesn't merge with it, so include a fill class if you need one (`AuthHeader` passes `fill-primary` explicitly).

```tsx
<OzeaonLogo className="h-9 w-[26px] md:h-7 md:w-5" />
```

## SiteTitle

The "Ozeaon" wordmark. It defaults to 82 × 17 and is usually paired with `OzeaonLogo`.

- **Source:** [src/components/icons/SiteTitle.tsx](https://github.com/ozeaon/ozeaon-v2/blob/0a4f1a95824db87782f1221a4108019d174df3d9/src/components/icons/SiteTitle.tsx)
- **Kind:** No directive
- **Used in:** `src/components/nav/TopNav.tsx`, `src/components/nav/MegaMenu.tsx`

Accepts `SVGProps<SVGSVGElement>`. As with `OzeaonLogo`, a passed `className` replaces the default `fill-primary`.

```tsx
<OzeaonLogo />
<SiteTitle />
```
