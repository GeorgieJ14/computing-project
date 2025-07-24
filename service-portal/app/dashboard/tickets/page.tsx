import { fetchCurrentUser, fetchFilteredTickets, fetchTicketsPages } from "@/lib/data";
import TicketsLists from "@/app/dashboard/tickets/tickets-lists";
import { Metadata } from "next";
import Pagination from "@/app/ui-components/tickets/pagination";
import { CreateTicket } from "@/app/ui-components/tickets/buttons";

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
  const ticketsList1 = await fetchFilteredTickets(query, currentPage);
  const currentUser = await fetchCurrentUser();

  return (
    <TicketsLists ticketsList1={ticketsList1}
      currentUser={currentUser}
      pagination={<Pagination totalPages={totalPages} />}
      createTicket={<CreateTicket />} />
  );
}
