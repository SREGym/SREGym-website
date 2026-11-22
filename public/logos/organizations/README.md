# Organization logos

These transparent PNGs are copied from the SREGym repository's
[`assets/who-uses`](https://github.com/SREGym/SREGym/tree/main/assets/who-uses)
directory. They are the same light and dark variants used in the
[README logo wall](https://github.com/SREGym/SREGym#who-uses-sregym).

`logo-sources.json` records the upstream sources of the original brand assets.
The website serves the prepared PNGs locally and switches variants with its
existing theme controls. The PNG files are unchanged. CSS frames exclude their
transparent padding so the visible marks can be sized consistently. The wall
uses the original brand colors at full opacity in both themes.

When updating the logo wall, copy both theme variants and update the organization
list in `app/(home)/components/logo-wall.tsx` to match the SREGym README. If a PNG
changes, update its visible pixel bounds in `logo-wall-layout.json` beside that
component.
