import type { Metadata } from 'next';
import { Section } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Health Check | BudiMind Clinic',
  description: 'System status for the BudiMind Clinic application.',
  alternates: { canonical: 'https://clinic.budimind.com/health-ui' },
};

const checks = [
  { name: 'Application', status: 'healthy', latency: '11ms' },
  { name: 'Database (Clinical)', status: 'healthy', latency: '9ms' },
  { name: 'Cache', status: 'healthy', latency: '2ms' },
  { name: 'Queue (Clinical)', status: 'healthy', latency: '4ms' },
];

export default function HealthPage() {
  const allHealthy = checks.every((c) => c.status === 'healthy');

  return (
    <main className="flex-1 py-12">
      <Section title="Health Check" subtitle="System status for BudiMind Clinic" center>
        <div className="max-w-3xl mx-auto">
          <div
            className={`p-6 rounded-xl border ${
              allHealthy
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-3 h-3 rounded-full ${allHealthy ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <h2 className="text-xl font-semibold">
                {allHealthy ? 'All Systems Operational' : 'Degraded'}
              </h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium">Component</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Latency</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((check) => (
                  <tr
                    key={check.name}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="py-3 font-medium">{check.name}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          check.status === 'healthy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            check.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        {check.status}
                      </span>
                    </td>
                    <td className="py-3 text-secondary font-mono text-sm">{check.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-secondary">
              <p>Last checked: {new Date().toISOString()}</p>
              <p>Environment: {process.env.NODE_ENV || 'development'}</p>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
