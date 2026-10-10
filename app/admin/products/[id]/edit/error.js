'use client';

export default function EditError({ error, reset }) {
  return (
    <div className="border border-sand p-4 text-sm">
      <p className="text-ink mb-2">The Edit page hit a problem:</p>
      <pre className="text-xs text-magenta whitespace-pre-wrap">{String(error?.message || error)}</pre>
      <pre className="text-xs text-ink/50 whitespace-pre-wrap mt-2">
        {String(error?.stack || '').split('\n').slice(0, 5).join('\n')}
      </pre>
      <button onClick={reset} className="mt-3 text-xs underline">
        Try again
      </button>
    </div>
  );
}