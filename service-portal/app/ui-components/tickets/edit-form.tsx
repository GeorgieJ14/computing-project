'use client';

import prisma from '@/lib/database/prisma/prisma';
import {
  CheckIcon,
  ClockIcon,
//   CurrencyDollarIcon,
  UserCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui-components/button';
import { updateTicket, State } from '@/lib/actions';
import { useActionState } from 'react';
import Image from 'next/image';

export default function EditTicketForm({
  ticket,
  users,
}: {
  ticket: typeof prisma.ticket;
  users: typeof prisma.user[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updateTicketWithId = updateTicket.bind(null, ticket.id);
  const [state, formAction] = useActionState(updateTicketWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="user" className="mb-2 block text-sm font-medium">
            Choose user
          </label>
          <div className="relative">
            <select
              id="user"
              name="userId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={ticket.user_id}
              aria-describedby="user-error"
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="user-error" aria-live="polite" aria-atomic="true">
            {state.errors?.userId &&
              state.errors.userId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title of request/complaint.
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title" disabled
                name="title"
                type="text"
                defaultValue={ticket.title}
                placeholder="Title of request/complaint."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="title-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="mb-4">
          <label htmlFor="details" className="mb-2 block text-sm font-medium">
            Enter your request/complaint details
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="details" disabled
                name="details"
                type="text"
                defaultValue={ticket.details}
                placeholder="Enter your request/complaint details"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="details-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="details-error" aria-live="polite" aria-atomic="true">
            {state.errors?.details &&
              state.errors.details.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="mb-2 block text-sm font-medium">
            Enter tags/keywords about your request/complaint.
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="tags"
                name="tags"
                type="text"
                defaultValue={ticket.tags}
                placeholder="Enter tags/keywords about your request/complaint."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="tags-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="tags-error" aria-live="polite" aria-atomic="true">
            {state.errors?.tags &&
              state.errors.tags.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
    
        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            Date of ticket/complaint.
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input disabled
                id="date"
                name="date"
                type="date" defaultValue={ticket.date.toISOString().split('T')[0]}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="date-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="attachments" className="mb-2 block text-sm font-medium">
            Upload images related to your request/complaint.
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              {ticket.attachments.map((attachment) => (
                <div key={attachment.fileName} className="mb-2 flex items-center gap-2">
                  <Image
                    src={`/file_uploads/ticket_images/${attachment.fileName}`}
                    alt={attachment.fileName}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <span className="text-sm text-gray-600">{attachment.fileName}</span>
                </div>
              ))}
              <input
                id="attachments" disabled
                name="attachments"
                type="file"
                multiple accept='image/*'
                placeholder="Upload images related to your request/complaint."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="attachments-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="attachments-error" aria-live="polite" aria-atomic="true">
            {/* {state.errors?.attachments &&
              state.errors.attachments.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
          </div>
        </div>

        {/* Ticket Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the Ticket status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={ticket.status === 'pending'}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="resolved"
                  name="status"
                  type="radio"
                  value="resolved"
                  defaultChecked={ticket.status === 'resolved'}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="resolved"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Resolved <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        <div className="mb-4">
          <label htmlFor="priority" className="mb-2 block text-sm font-medium">
            Ticket-priority
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <p className='mt-2 text-gray-900'>{ticket.priority}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="assignedToUser" className="mb-2 block text-sm font-medium">
            Assigned to User
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <p className='mt-2 text-gray-900'>
                {ticket.assignedToUser ? ticket.assignedToUser?.name + ' (' +
                ticket.assignedToUser?.role?.name + ')' : 'Not assigned'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <p className='mt-2 text-gray-900'>
                {ticket.category?.name ?? 'No category assigned'}
              </p>
            </div>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/Tickets"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Ticket</Button>
      </div>
    </form>
  );
}
