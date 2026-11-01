# Risks

- **localStorage** – data is per browser/device, limited in size and lost if site data is cleared.
- **No sync / multi-user** – two tabs overwrite each other (last write wins).
- **Accessibility** – keyboard drag works, but screen-reader announcements are default only and not tuned.
- **Delete is permanent** – no undo for tasks or columns.
- **Pre-release dependencies** – the installed versions are very recent (Next 16, Tailwind 4, Motion 14); expect breaking changes on upgrades.
- **Column colors are decorative** – the title carries the meaning; color alone is never relied on. Old saved boards have no stored color and get a position-based one until columns are re-created.
- **Touch drag delay** – drags on touch start after a ~200 ms press; users may need to hold slightly longer.
