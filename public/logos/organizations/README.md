# Organization logos

These transparent PNGs are copied from the SREGym repository's
[`assets/who-uses`](https://github.com/SREGym/SREGym/tree/main/assets/who-uses)
directory. They are the same light and dark variants used in the
[README logo wall](https://github.com/SREGym/SREGym#who-uses-sregym).

`logo-sources.json` records the upstream sources of the original brand assets.
The website serves the prepared PNGs locally and switches variants with its
existing theme controls. The PNG files are unchanged. The Users page uses the
prepared theme variants at full opacity.

The initial assets and organization list came from SREGym commit
`b723f5407fc399ffe6f0fe06f18a7bdd78e7d2ab`. Display heights follow the README's
relative proportions, enlarged slightly for the dedicated page.

UW's official stacked signatures come from SREGym commit
`274269094bf447f708a21da9e9cae451f2b140d7`. They are served as
`washington-stacked.png` in each theme.

When updating the logo wall, copy both theme variants and update the organization
list, links, display heights, and native image dimensions in
`app/(home)/components/organizations.json` to match the SREGym README.
Set an organization's optional `file` field when its asset filename differs
from its ID.
Use plain local asset paths. The deployed Amplify image optimizer fails to load
local image URLs with query parameters. If cache busting is needed, rename the
asset files instead.
