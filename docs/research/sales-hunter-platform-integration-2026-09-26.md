# Sales-Hunter platform entry — specification

Status: draft for review. Owner request: integrate Sales-Hunter into donghanhcungban.org.
Related accepted Sales ADR: seeker19110/Sales-Hunter/docs/adr/0002-platform-subdomain-dhcb.md.
This branch proposes the frontend implementation alongside the spec; it is not merged or
represented as an already approved/deployed new feature.

## Scope

Add an independent, accessible product entry after the existing application content on the
main DHCB hostname. Do not restore removed Career/Startup/Life studios, alter router paths,
modify auth/billing/mastery, or embed an operator dashboard iframe. Sales stays a separate
Python application and independent deployment at sales.donghanhcungban.org.

The entry is visible on the root/WWW site and local development only, not en-vi or other
Learning hosts. It defaults to an honest unavailable state. The exact build flag
`VITE_SALES_HUNTER_PILOT_ENABLED=true` opens a fixed HTTPS URL in a new tab with no referrer,
query credentials, SSO handoff or extra tracking. This flag controls discoverability only;
it is never authorization. Direct access must be protected independently by Sales/Access.

## Acceptance

- Existing application, navigation and removed studio decisions remain intact.
- No destination URL from user input, localStorage or query strings.
- Disabled state has no clickable remote launch link; strings other than `true` stay off.
- Keyboard-accessible details and clearly labeled new-tab link.
- Separate staging/HTTPS/Access/rollback evidence from Sales is required before flag on.
- Test root and Learning hosts, desktop/mobile, keyboard focus and all existing themes.

## Deployment and rollback

No VPS, DNS, account or secrets are changed by this PR. Deploy the Sales read-only pilot and
record its checks first, then rebuild DHCB with the flag. Roll back the flag independently;
revoking existing Sales access also requires disabling Access/stopping Sales itself.
No claim is made that the complete Sales approval/publishing workflow is production ready.
