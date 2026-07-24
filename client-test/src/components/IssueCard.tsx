import { useState } from 'react';
import { Badge, Button, Tooltip } from '@commonforge/ui';
import type { BadgeColor } from '@commonforge/ui';
import { Trash2, Save } from 'lucide-react';

type TagKey = 'bug' | 'feature' | 'improvement';

interface Tag {
  key: TagKey;
  label: string;
  color: Extract<BadgeColor, 'red' | 'blue' | 'purple'>;
}

const ALL_TAGS: Tag[] = [
  { key: 'bug',         label: 'Bug',         color: 'red' },
  { key: 'feature',     label: 'Feature',     color: 'blue' },
  { key: 'improvement', label: 'Improvement', color: 'purple' },
];

export function IssueCard() {
  const [tags, setTags] = useState<Tag[]>(ALL_TAGS);
  const [submitting, setSubmitting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const removeTag = (key: TagKey) =>
    setTags((current) => current.filter((t) => t.key !== key));

  const onSave = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
  };

  if (deleted) {
    return (
      <section className="mx-auto w-full max-w-2xl px-6 py-12">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-default bg-surface px-6 py-16 text-center">
          <p className="text-sm text-text-muted">Issue dihapus.</p>
          <Button variant="outline" size="sm" onClick={() => { setDeleted(false); setTags(ALL_TAGS); }}>
            Pulihkan demo
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-12">
      <article className="relative flex flex-col gap-5 rounded-xl border border-border-default bg-surface p-6 shadow-foundation-sm">
        <div className="absolute right-4 top-4">
          <Badge color="green" closable={false}>READY</Badge>
        </div>

        <header className="pr-20">
          <p className="text-xs uppercase tracking-wide text-text-muted">Issue #248</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-text-primary">
            Refactor dropdown popover anchoring
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Dropdown popup mis-aligns saat <code className="text-text-secondary">hint</code> /
            <code className="text-text-secondary"> error</code> aktif. Migrate ke `popup` prop API.
          </p>
        </header>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-text-secondary">Tags</p>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.key}
                  color={tag.color}
                  onClose={() => removeTag(tag.key)}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-disabled italic">Tidak ada tag — semua sudah dihapus.</p>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
          <Tooltip content="Delete" variant="error">
            <Button
              variant="outline"
              size="sm"
              iconOnly
              leftIcon={<Trash2 size={14} />}
              aria-label="Delete issue"
              onClick={() => setDeleted(true)}
            />
          </Tooltip>

          <Button
            variant="primary"
            size="sm"
            loading={submitting}
            leftIcon={<Save size={14} />}
            onClick={onSave}
          >
            Save
          </Button>
        </footer>
      </article>
    </section>
  );
}
