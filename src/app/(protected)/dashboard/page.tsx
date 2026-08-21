import { getDb } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const db = getDb();
  
  // Get stats
  const totalPatients = db.prepare('SELECT COUNT(*) as count FROM patients').get().count as number;
  const totalAssessments = db.prepare('SELECT COUNT(*) as count FROM assessment_responses').get().count as number;
  const totalCompanies = db.prepare('SELECT COUNT(*) as count FROM companies').get().count as number;
  
  // Recent assessments (last 7 days)
  const recentAssessments = db.prepare(`
    SELECT ar.*, p.full_name as patient_name, a.title as assessment_title
    FROM assessment_responses ar
    JOIN patients p ON ar.patient_id = p.id
    JOIN (
      SELECT 'dass21' as type, 'DASS-21' as title UNION ALL
      SELECT 'phq9', 'PHQ-9' UNION ALL
      SELECT 'gad7', 'GAD-7' UNION ALL
      SELECT 'k10', 'K10' UNION ALL
      SELECT 'who5', 'WHO-5' UNION ALL
      SELECT 'whodas2', 'WHODAS 2.0' UNION ALL
      SELECT 'coreom', 'CORE-OM' UNION ALL
      SELECT 'pcl5', 'PCL-5' UNION ALL
      SELECT 'asrs', 'ASRS' UNION ALL
      SELECT 'isi', 'ISI' UNION ALL
      SELECT 'bdi2', 'BDI-II' UNION ALL
      SELECT 'bai', 'BAI' UNION ALL
      SELECT 'ybocs', 'Y-BOCS' UNION ALL
      SELECT 'epds', 'EPDS'
    ) a ON ar.assessment_type = a.type
    WHERE ar.completed_at >= date('now', '-7 days')
    ORDER BY ar.completed_at DESC
    LIMIT 5
  `).all();
  
  // Assessments by type (last 30 days)
  const assessmentsByType = db.prepare(`
    SELECT 
      ar.assessment_type,
      COUNT(*) as count
    FROM assessment_responses ar
    WHERE ar.completed_at >= date('now', '-30 days')
    GROUP BY ar.assessment_type
    ORDER BY count DESC
  `).all();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Dashboard Overview
        </h1>
        <div className="flex space-x-4">
          <Link href="/dashboard/trends">
            <button className="button-secondary">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3v6l3-3"></path></svg>
              Trends
            </button>
          </Link>
          <Link href="/dashboard/company">
            <button className="button-secondary">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v1H3zM3 5v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path></svg>
              Corporate
            </button>
          </Link>
          <button className="button-secondary">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path></svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Patients */}
        <div className="washi-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Patients
              </h3>
              <p className="text-2xl font-bold">{totalPatients}</p>
            </div>
            <div className="h-10 w-10 bg-primary/20 rounded flex items-center justify-center">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6.216A4.02 4.02 0 0023 18.5V10m0 8a4 4 0 11-7.765-2.124" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Total Assessments */}
        <div className="washi-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Assessments
              </h3>
              <p className="text-2xl font-bold">{totalAssessments}</p>
            </div>
            <div className="h-10 w-10 bg-primary/20 rounded flex items-center justify-center">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 0a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Total Companies */}
        <div className="washi-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Organizations
              </h3>
              <p className="text-2xl font-bold">{totalCompanies}</p>
            </div>
            <div className="h-10 w-10 bg-primary/20 rounded flex items-center justify-center">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 10H5v-3h14v3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Recent Assessments (Last 7 Days)
        </h2>
        {recentAssessments.length > 0 ? (
          <div className="space-y-4">
            {recentAssessments.map((assessment: any) => (
              <div key={assessment.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="hanko-badge">{assessment.assessment_type.toUpperCase()}</div>
                  <div>
                    <h3 className="font-medium">{assessment.patient_name}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(assessment.completed_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{assessment.raw_scores ? JSON.parse(assessment.raw_scores).total || 0 : 0}</p>
                  <span className="text-xs hanko-badge">
                    {assessment.raw_scores ? JSON.parse(assessment.raw_scores).severity || '' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No recent assessments in the last 7 days.
          </p>
        )}
      </div>

      {/* Assessments by Type Chart Placeholder */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Assessments by Type (Last 30 Days)
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {assessmentsByType.map((stat: any) => (
            <div key={stat.assessment_type} className="washi-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-left">{stat.assessment_type.toUpperCase()}</h3>
                  <p className="text-sm text-muted-foreground">assessments</p>
                </div>
                <div className="text-2xl font-bold text-right">{stat.count}</div>
              </div>
              <div className="h-2 mt-2 bg-primary/20 rounded overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min((stat.count / Math.max(...assessmentsByType.map((s: any) => s.count)) * 100, 100))}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}