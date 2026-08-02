import { Link } from 'react-router-dom';
import Badge from '@/components/ui/Badge';

const ROWS = [
  { id: 1, name: 'Alex Rivera', role: 'Senior Frontend Engineer', position: 'Lead UI Designer', status: 'Under Review', applied: '2 hours ago' },
  { id: 2, name: 'Sarah Chen', role: 'Data Scientist', position: 'ML Researcher', status: 'Shortlisted', applied: '5 hours ago' },
  { id: 3, name: 'Marcus Thorne', role: 'Product Manager', position: 'Senior PM', status: 'Initial Screen', applied: 'Yesterday' },
  { id: 4, name: 'Elena Rodriguez', role: 'Systems Architect', position: 'Staff Engineer', status: 'Rejected', applied: '2 days ago' },
];

const STATUS_VARIANT = {
  'Under Review': 'neutral',
  Shortlisted: 'success',
  'Initial Screen': 'neutral',
  Rejected: 'error',
};

const AVATAR_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-purple-500 to-purple-700',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
];

export default function ApplicantTable() {
  return (
    <div className="bg-surface-white rounded-xl border border-border-subtle overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <h2 className="font-poppins font-bold text-body text-text-heading">Recent Applicant Activity</h2>
        <Link to="/company/applicants" className="font-inter text-small font-semibold text-text-muted hover:text-text-heading transition-colors">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-small">
          <thead>
            <tr className="text-left font-inter text-caption font-semibold tracking-wider text-text-muted border-b border-border-subtle">
              <th className="px-5 py-3">Candidate</th>
              <th className="px-5 py-3">Position</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Applied Date</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.id} className="border-b border-border-subtle last:border-0 hover:bg-canvas-bg/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-caption font-bold shrink-0 ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}`}>
                      {r.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-poppins font-semibold text-text-heading">{r.name}</p>
                      <p className="font-inter text-caption text-text-muted">{r.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-text-body">{r.position}</td>
                <td className="px-5 py-4">
                  <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>
                </td>
                <td className="px-5 py-4 text-text-muted">{r.applied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
