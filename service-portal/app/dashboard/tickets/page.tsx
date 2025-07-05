import Pagination from '@/app/ui-components/tickets/pagination';
import Search from '@/app/ui-components/search';
import Table from '@/app/ui-components/tickets/table';
import { CreateTicket } from '@/app/ui-components/tickets/buttons';
import { TicketsTableSkeleton } from '@/app/ui-components/skeletons';
import { Suspense } from 'react';
import { fetchTicketsPages } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tickets',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchTicketsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Tickets</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search tickets..." />
        <CreateTicket />
      </div>
      <Suspense key={query + currentPage} fallback={<TicketsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
