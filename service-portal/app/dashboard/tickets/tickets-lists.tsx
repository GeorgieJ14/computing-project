'use client'

// import Pagination from '@/app/ui-components/tickets/pagination';
import Search from '@/app/ui-components/search';
import Table from '@/app/ui-components/tickets/table';
// import { CreateTicket } from '@/app/ui-components/tickets/buttons';
import { Button } from '@/app/ui-components/button';
import { TicketsTableSkeleton } from '@/app/ui-components/skeletons';
import { Suspense, useState, useCallback } from 'react';
// useEffect,
// import { fetchFilteredTickets, fetchTicketsPages } from '@/lib/data';
import prisma from '@/lib/database/prisma/prisma';
// import { Metadata } from 'next';
import { huggingFaceApi } from '@/lib/huggingface';
// import CategorisationButton from '@/app/ui-components/tickets/categorisation-button';

/* export const metadata: Metadata = {
  title: 'Tickets',
}; */

export default function TicketsLists(props: {
  ticketsList1: typeof prisma.ticket[];
  currentUser: typeof prisma.user;
  pagination: React.ReactNode;
  createTicket: React.ReactNode;
  query: string;
  currentPage: number;
}) {
  /* const searchParams = use(props.searchParams);
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = use(fetchTicketsPages(query));
  const ticketsList1 = use(fetchFilteredTickets(query, currentPage)); */
  const [ticketsList, setTicketsList] = useState(props.ticketsList1);
  const isAdminUser = [1, 2].includes(props.currentUser?.role?.id);
  const categorizeTickets1 = useCallback(() => {
    const updatedResp = huggingFaceApi(ticketsList, props.query,
      props.currentPage);
    updatedResp.then((updatedResp) => {
      // console.log(updatedTickets, "test-message123");
      const updatedTicketsList = updatedResp.updatedTickets;
      setTicketsList(updatedTicketsList);
      alert(updatedResp.updatedCount + " tickets updated and categorised.  " +
        updatedResp.spamTickets + " spam-tickets detected.   " +
        updatedResp.ticketsAssigned + " tickets assigned to service-personnel.");
    });
  }, []);

  //  useEffect(categorizeTickets1, [categorizeTickets1]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>
          {props.currentUser?.role?.id == 4 && "Your"} Tickets
        </h1>
        <Button title="Click to activate A.I."
          onClick={categorizeTickets1}
          disabled={!isAdminUser}
          className={`cursor-pointer ${!isAdminUser ? 'hidden' : ''}`}
          /* updatedTickets={handleUpdatedTickets} */ >
          A.I Categorization, Filtering
        </Button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search tickets..." />
        {/* <CreateTicket /> */}
        {(props.currentUser?.role?.id == 4) && props.createTicket}
      </div>
      <Suspense key="ticketsLists1" fallback={<TicketsTableSkeleton />}>
        <Table tickets={ticketsList} /* query={query} currentPage={currentPage} */
          isAdminUser={isAdminUser}/>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={props.totalPages} /> */}
        {props.pagination}
      </div>
    </div>
  );

}
