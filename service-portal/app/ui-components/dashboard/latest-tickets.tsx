import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { fetchLatestTickets } from '@/lib/data';
import { formatDateToLocal } from '@/lib/utils';
import prisma from '@/lib/database/prisma/prisma';

export default async function LatestTickets(
  {currentUser}: {currentUser: typeof prisma.user}
) {
  const latestTickets = await fetchLatestTickets();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl">
        {(currentUser?.role?.id == 4) && "Your"} Latest Tickets
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestTickets.map((ticket, i) => {
            return (
              <div
                key={ticket.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <Image
                    src={ticket.attachments ? '/' + ticket.attachments[0].fileName : '/file.svg'}
                    alt={`${ticket.title}'s picture`}
                    className={`${ticket.attachments ? '' : 'hidden'} mr-4 rounded-full`}
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {ticket.title}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {formatDateToLocal(ticket.date)}
                    </p>
                  </div>
                </div>
                <p
                  className={`truncate text-sm font-medium md:text-base`}
                >
                  {ticket.details}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
