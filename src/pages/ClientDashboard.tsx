import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { DashboardStats } from '../components/dashboard/DashboardStats'
import { RecentDocuments } from '../components/dashboard/RecentDocuments'
import { StatusWidget } from '../components/dashboard/StatusWidget'
import { NotificationsWidget } from '../components/dashboard/NotificationsWidget'

export function ClientDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins gradient-text mb-2">
            Tableau de bord
          </h1>
          <p className="text-slate-400">
            Suivez l'avancement de votre LLC et gérez vos documents.
          </p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StatusWidget />
          <NotificationsWidget />
        </div>

        <RecentDocuments />
      </div>
    </DashboardLayout>
  )
}