import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="container-max py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Automate your social media workflow
        </h1>
        <p className="mt-4 text-slate-600">
          Generate content, schedule posts, and track engagement across Instagram, Facebook, and
          Pinterest ? from a single dashboard.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/dashboard" className="btn btn-primary">
            Open Dashboard
          </Link>
          <a
            href="https://buffer.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            Inspired by Buffer & Hootsuite
          </a>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard title="AI-style Generation" description="Smart captions, images, and hashtags based on category and topic." />
        <FeatureCard title="Cross-Platform Scheduling" description="Plan Instagram, Facebook, and Pinterest posts in one place." />
        <FeatureCard title="Engagement Tracking" description="Monitor performance with simulated insights to iterate quickly." />
      </div>
    </section>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

