export default function PrivacyPage() {
  return (
    <article className="prose prose-invert prose-sm max-w-2xl mx-auto animate-fade-in py-4">
      <h1 className="font-display text-3xl text-echo-50">Privacy Policy</h1>
      <p className="text-ink-400 text-sm">
        Last updated: {new Date().toISOString().slice(0, 10)}.
      </p>
      <h2 className="text-echo-100">What we store</h2>
      <ul className="text-ink-300">
        <li>Account email, display name, password hash (not plain password)</li>
        <li>Plan, daily usage counters</li>
        <li>Optional payment customer IDs when Stripe is enabled</li>
        <li>
          Story content you generate may be sent to the AI provider (xAI) to
          produce the next scene
        </li>
        <li>
          Browser localStorage may hold stories, profile kinks, loadouts, and
          favorites on your device
        </li>
        <li>
          If the operator enables Redis (Upstash), account and share-code data
          may be stored there for multi-device durability
        </li>
      </ul>
      <h2 className="text-echo-100">Cookies</h2>
      <p className="text-ink-300">
        We use an HTTP-only session cookie (<code>ee_session</code>) to keep you
        signed in.
      </p>
      <h2 className="text-echo-100">Third parties</h2>
      <p className="text-ink-300">
        AI generations use xAI/Grok APIs. Payments may use Stripe. Their
        policies apply to data they process.
      </p>
      <h2 className="text-echo-100">Retention</h2>
      <p className="text-ink-300">
        Account records remain until you request deletion or the operator
        purges data. Local browser data can be cleared by you anytime.
      </p>
      <h2 className="text-echo-100">Contact</h2>
      <p className="text-ink-300">
        Privacy requests: contact the operator of this deployment.
      </p>
    </article>
  );
}
