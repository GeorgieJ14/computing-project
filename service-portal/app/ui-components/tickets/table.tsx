'use client'

import Image from 'next/image';
import { UpdateTicket, DeleteTicket } from '@/app/ui-components/tickets/buttons';
import TicketStatus from '@/app/ui-components/tickets/status';
import { formatDateToLocal } from '@/lib/utils';
// formatCurrency
// import { fetchFilteredTickets } from '@/lib/data';
import prisma from '@/lib/database/prisma/prisma';

export default function TicketsTable({
  /* query,
  currentPage, */
  tickets, isAdminUser
}: {
  /* query: string;
  currentPage: number; */
  tickets: typeof prisma.ticket[];
  isAdminUser: boolean
}) {
  // const tickets: typeof prisma.ticket[] = await fetchFilteredTickets(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {tickets?.map((ticket) => (
              <div
                key={ticket.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={ticket.attachments ? '/' + ticket.attachments[0].fileName : '/file.svg'}
                        className={`${ticket.attachments ? '' : 'hidden'} mr-2 rounded-full`}
                        width={28}
                        height={28}
                        alt={`${ticket.title}'s picture`}
                      />
                      <p className='text-l font-medium'>{ticket.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{formatDateToLocal(ticket.date)}</p>
                  </div>
                  <TicketStatus status={ticket.status} />
                  <p className='text-l font-medium'>
                    Category: {ticket.category?.name ?? '---'}
                  </p>
                  <p className='text-l font-medium'>
                    Priority: {ticket.priority ?? '---'}
                  </p>
                  <p className='text-l font-medium'>
                    Assigned-to user: {ticket.assignedToUser ?
                    ticket.assignedToUser?.name + ' (' +
                    ticket.assignedToUser?.role?.name + ')' : '---'}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-l font-medium">
                      {ticket.details}
                    </p>
                    <p>{formatDateToLocal(ticket.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateTicket id={ticket.id} />
                    {isAdminUser && <DeleteTicket id={ticket.id} /> }
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Priority
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Assigned-to user
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Details
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tags
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tickets?.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={ticket.attachments ? '/' + ticket.attachments[0].fileName : '/file.svg'}
                        className={`${ticket.attachments ? '' : 'hidden'} rounded-full`}
                        width={28}
                        height={28}
                        alt={`${ticket.title}'s picture`}
                      />
                      <p className='text-l font-medium'>{ticket.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(ticket.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {ticket.category?.name ?? '---'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {ticket.priority ?? '---'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {ticket.assignedToUser ? ticket.assignedToUser?.name + ' (' +
                    ticket.assignedToUser?.role?.name + ')' : '---'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {ticket.details?.slice(0, 25)}{(ticket.details?.length > 25) && "..."}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {ticket.tags}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <TicketStatus status={ticket.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTicket id={ticket.id} />
                      {isAdminUser && <DeleteTicket id={ticket.id} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
