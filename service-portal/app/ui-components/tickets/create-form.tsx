'use client';

import prisma from '@/lib/database/prisma/prisma';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
//   CurrencyDollarIcon,
  UserCircleIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui-components/button';
import { createTicket, State } from '@/lib/actions';
import { useActionState } from 'react';

export default function Form({ users, currentUser }: {
  users: typeof prisma.user[],
  currentUser: typeof prisma.user
}) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createTicket, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="user" className="mb-2 block text-sm font-medium text-gray-900">
            Choose user
          </label>
          <div className="relative">
            <select
              id="user"
              name="userId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-800 text-gray-900"
              defaultValue={currentUser?.id}
              aria-describedby="user-error"
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}
                  disabled={user.id != currentUser?.id}>
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
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900">
            Enter your request/complaint title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter your request/complaint title"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-800 text-gray-900"
                aria-describedby="title-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="mb-4">
          <label htmlFor="details" className="mb-2 block text-sm font-medium text-gray-900">
            Enter your request/complaint details
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="details"
                name="details"
                type="text"
                placeholder="Enter your request/complaint details"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-800 text-gray-900"
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
          <label htmlFor="tags" className="mb-2 block text-sm font-medium text-gray-900">
            Enter tags/keywords about your request/complaint.
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="tags"
                name="tags"
                type="text"
                placeholder="Enter tags/keywords about your request/complaint."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-800 text-gray-900"
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
          <label htmlFor="attachments" className="mb-2 block text-sm font-medium text-gray-900">
            Upload images related to your request/complaint.
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="attachments"
                name="attachments"
                type="file"
                multiple accept='image/*'
                placeholder="Upload images related to your request/complaint."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-800 text-gray-900"
                aria-describedby="attachments-error"
              />
              <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
          <legend className="mb-2 block text-sm font-medium text-gray-900">
            Set the ticket status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending" checked readOnly
                  name="status"
                  type="radio"
                  value="pending"
                  className="text-white-600 h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-900"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="resolved" disabled
                  name="status"
                  type="radio"
                  value="resolved"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
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

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/tickets"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Ticket</Button>
      </div>
    </form>
  );
}
