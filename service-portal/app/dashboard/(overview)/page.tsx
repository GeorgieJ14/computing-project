import CardWrapper from '@/app/ui-components/dashboard/cards';
import TicketsChart from '@/app/ui-components/dashboard/tickets-chart';
import LatestTickets from '@/app/ui-components/dashboard/latest-tickets';
import { Suspense } from 'react';
import {
  TicketsChartSkeleton,
  LatestTicketsSkeleton,
  CardsSkeleton,
} from '@/app/ui-components/skeletons';
import { fetchCurrentUser } from '@/lib/data';

export default async function Page() {
  const currentUser = await fetchCurrentUser();
  // const isAdminUser = [1, 2].includes(currentUser?.role?.id ?? 0);
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper currentUser={currentUser}/>
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<TicketsChartSkeleton />}>
          {/*isAdminUser && <TicketsChart />*/}
        </Suspense>
        <Suspense fallback={<LatestTicketsSkeleton />}>
          <LatestTickets currentUser={currentUser} />
        </Suspense>
      </div>
    </main>
  );
}
