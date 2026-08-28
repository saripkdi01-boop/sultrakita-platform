# Visual QA findings

Desktop 1440px: fixed topbar renders the SultraKita brand, search pill, center tabs with active blue underline, action icons, and CTA. Sidebar and right rail are visible at the expected desktop breakpoint. The right rail contains donation progress, trending, and trusted-contact widgets. Main feed surfaces use the new neutral Facebook-style palette.

Mobile 390px: compact topbar and second-row search render without horizontal overflow; hero actions remain two-column; metric cards collapse to two columns; category row scrolls horizontally; five-item bottom navigation is visible with active blue indicator; menu tab is available for the bottom sheet.

The screenshots were captured with the API in offline/fallback mode, so the existing offline toast is visible and listing cards remain skeletons. This is expected for the local environment and does not indicate a CSS failure.
