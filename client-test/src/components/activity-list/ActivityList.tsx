import type { Activity } from '../../data/mock';

type Props = {
  items: Activity[];
};

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ActivityList({ items }: Props) {
  return (
    <ul className="flex flex-col">
      {items.map((item, i) => (
        <li
          key={item.id}
          className={
            'flex items-start gap-3 py-3 ' +
            (i < items.length - 1 ? 'border-b border-border-subtle' : '')
          }
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-xs font-semibold text-accent">
            {initials(item.user)}
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-sm text-text-primary">
              <span className="font-medium">{item.user}</span>{' '}
              <span className="text-text-muted">{item.action}</span>{' '}
              <span className="font-medium">{item.target}</span>
            </p>
            <p className="text-xs text-text-disabled">{item.timestamp}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
