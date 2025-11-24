/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { addMinutes, format, isAfter, isBefore, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { generateContent } from '@/lib/generation';

const PLATFORMS = ['Instagram', 'Facebook', 'Pinterest'] as const;
type Platform = (typeof PLATFORMS)[number];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'calendar' | 'engagement' | 'accounts'>(
    'compose'
  );

  return (
    <div className="container-max py-8">
      <SchedulerLoop />
      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <aside className="card p-4">
          <h2 className="text-sm font-semibold text-slate-600">Navigation</h2>
          <nav className="mt-2 grid gap-2">
            <TabButton label="Compose" active={activeTab === 'compose'} onClick={() => setActiveTab('compose')} />
            <TabButton label="Calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
            <TabButton label="Engagement" active={activeTab === 'engagement'} onClick={() => setActiveTab('engagement')} />
            <TabButton label="Accounts" active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} />
          </nav>
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-600">Connected Platforms</h3>
            <ConnectedPlatforms />
          </div>
        </aside>
        <section className="space-y-6">
          {activeTab === 'compose' && <Composer />}
          {activeTab === 'calendar' && <Calendar />}
          {activeTab === 'engagement' && <Engagement />}
          {activeTab === 'accounts' && <Accounts />}
        </section>
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
        active ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50'
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function ConnectedPlatforms() {
  const accounts = useStore((s) => s.accounts);
  return (
    <ul className="mt-2 grid gap-2 text-sm">
      {PLATFORMS.map((p) => {
        const count = accounts.filter((a) => a.platform === p && a.active).length;
        return (
          <li key={p} className="flex items-center justify-between rounded-md border px-3 py-2">
            <span>{p}</span>
            <span className="text-slate-500">{count} active</span>
          </li>
        );
      })}
    </ul>
  );
}

function Composer() {
  const addScheduledPost = useStore((s) => s.addScheduledPost);
  const accounts = useStore((s) => s.accounts);
  const [category, setCategory] = useState('Fitness');
  const [topic, setTopic] = useState('Morning routine');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['Instagram', 'Facebook']);
  const [scheduledAt, setScheduledAt] = useState(() => format(addMinutes(new Date(), 10), "yyyy-MM-dd'T'HH:mm"));
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/fitness/800/800');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);

  const activePlatforms = useMemo(
    () => selectedPlatforms.filter((p) => accounts.some((a) => a.platform === p && a.active)),
    [selectedPlatforms, accounts]
  );

  function handleGenerate() {
    const generated = generateContent({ category, topic });
    setCaption(generated.caption);
    setHashtags(generated.hashtags);
    setImageUrl(generated.imageUrl);
  }

  function handleSchedule() {
    if (activePlatforms.length === 0) return;
    addScheduledPost({
      platforms: activePlatforms,
      caption,
      hashtags,
      imageUrl,
      scheduledAt: new Date(scheduledAt).toISOString()
    });
    setCaption('');
    setHashtags([]);
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold">Compose</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {['Fitness', 'Travel', 'Food', 'Tech', 'Fashion', 'Business'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Topic</label>
              <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Morning routine" />
            </div>
          </div>
          <div>
            <label className="label">Platforms</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const checked = selectedPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    className={cn('btn btn-outline', checked && 'ring-2 ring-brand-400')}
                    onClick={() =>
                      setSelectedPlatforms((prev) =>
                        prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                      )
                    }
                    type="button"
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Only active, connected accounts will be scheduled.
            </p>
          </div>
          <div>
            <label className="label">Schedule At</label>
            <input
              type="datetime-local"
              className="input"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={handleGenerate} type="button">
              Generate Caption & Hashtags
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSchedule}
              type="button"
              disabled={activePlatforms.length === 0 || caption.trim().length === 0}
            >
              Schedule Post
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Image</label>
            <img src={imageUrl} alt="preview" className="mt-2 aspect-square w-full rounded-lg object-cover" />
          </div>
          <div>
            <label className="label">Caption</label>
            <textarea className="input h-32" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
          <div>
            <label className="label">Hashtags</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {hashtags.map((h) => (
                <span key={h} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Calendar() {
  const scheduled = useStore((s) => s.scheduled);
  const posted = useStore((s) => s.posted);
  const now = new Date();

  const items = [...scheduled, ...posted].sort((a, b) =>
    isBefore(parseISO(a.scheduledAt), parseISO(b.scheduledAt)) ? -1 : 1
  );

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold">Calendar</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((item) => {
          const inPast = isAfter(now, parseISO(item.scheduledAt));
          const status = 'postedAt' in item ? 'Posted' : inPast ? 'Missed' : 'Scheduled';
          return (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{format(parseISO(item.scheduledAt), 'PPpp')}</p>
                  <p className="mt-1 line-clamp-2 text-sm">{item.caption}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.hashtags.slice(0, 6).map((h) => (
                      <span key={h} className="rounded bg-slate-100 px-2 py-0.5 text-[11px]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-1 text-xs',
                    status === 'Posted' && 'bg-green-100 text-green-700',
                    status === 'Scheduled' && 'bg-yellow-100 text-yellow-700',
                    status === 'Missed' && 'bg-slate-100 text-slate-600'
                  )}
                >
                  {status}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                {item.platforms.map((p) => (
                  <span key={p} className="rounded border px-2 py-0.5">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="rounded-lg border p-6 text-center text-slate-500">
            No scheduled posts yet. Create one in Compose.
          </div>
        )}
      </div>
    </div>
  );
}

function Engagement() {
  const analytics = useStore((s) => s.analytics);
  const posted = useStore((s) => s.posted);
  const totals = analytics.reduce(
    (acc, a) => {
      acc.likes += a.likes;
      acc.comments += a.comments;
      acc.shares += a.shares;
      return acc;
    },
    { likes: 0, comments: 0, shares: 0 }
  );

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold">Engagement</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Metric label="Likes" value={totals.likes} />
        <Metric label="Comments" value={totals.comments} />
        <Metric label="Shares" value={totals.shares} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {posted.map((p) => {
          const a = analytics.find((x) => x.postId === p.id);
          return (
            <div key={p.id} className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <img src={p.imageUrl} alt="" className="h-16 w-16 rounded object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm">{p.caption}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>{format(parseISO(p.scheduledAt), 'PP')}</span>
                    <span>?</span>
                    <span>{p.platforms.join(', ')}</span>
                  </div>
                </div>
              </div>
              {a && (
                <div className="mt-3 flex gap-3 text-sm text-slate-700">
                  <span>?? {a.likes}</span>
                  <span>?? {a.comments}</span>
                  <span>?? {a.shares}</span>
                </div>
              )}
            </div>
          );
        })}
        {posted.length === 0 && (
          <div className="rounded-lg border p-6 text-center text-slate-500">No posts yet.</div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Accounts() {
  const accounts = useStore((s) => s.accounts);
  const addAccount = useStore((s) => s.addAccount);
  const toggle = useStore((s) => s.toggleAccountActive);
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [name, setName] = useState('');

  function handleAdd() {
    if (!name.trim()) return;
    addAccount({ platform, name });
    setName('');
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold">Accounts</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-[150px,1fr] items-center gap-2">
            <label className="label">Platform</label>
            <select className="input" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
              {PLATFORMS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-[150px,1fr] items-center gap-2">
            <label className="label">Account Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="@yourhandle" />
          </div>
          <div className="grid grid-cols-[150px,1fr] items-center gap-2">
            <div />
            <button className="btn btn-primary" onClick={handleAdd} type="button">
              Add Account
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-600">Connected</h3>
          <ul className="mt-2 space-y-2">
            {accounts.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-slate-500">{a.platform}</p>
                </div>
                <button
                  className={cn('btn', a.active ? 'btn-outline' : 'btn-primary')}
                  onClick={() => toggle(a.id)}
                  type="button"
                >
                  {a.active ? 'Disable' : 'Enable'}
                </button>
              </li>
            ))}
            {accounts.length === 0 && (
              <li className="rounded-lg border p-6 text-center text-slate-500">No accounts yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Simple scheduler loop
function SchedulerLoop() {
  const tick = useStore((s) => s.schedulerTick);
  useEffect(() => {
    const id = setInterval(() => tick(), 5_000);
    return () => clearInterval(id);
  }, [tick]);
  return null;
}

