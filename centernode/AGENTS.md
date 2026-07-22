<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Component spawn rules

**ALWAYS read [CENTERNODE-RULES.md](./CENTERNODE-RULES.md) before adding
or modifying any component spawn logic** (CfLibraryPanel, variantPresets,
composite builders, isPropVisibleForVariant, etc.).

Three non-negotiable rules:
1. Variant pill ALWAYS in Props panel
2. Props ↔ Code bidirectional sync
3. Variant must flow through code

Breaking any of these = broken UX + lost user trust + wasted tokens.
