import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { fetchCardData } from '@/lib/data';
import prisma from '@/lib/database/prisma/prisma';

const iconMap = {
  resolved: BanknotesIcon,
  users: UserGroupIcon,
  pending: ClockIcon,
  tickets: InboxIcon,
};

export default async function CardWrapper({currentUser}: {
  currentUser: typeof prisma.user
}) {
  const {
    numberOfTickets,
    numberOfUsers,
    totalResolvedTickets,
    totalPendingTickets,
  } = await fetchCardData();
  const isAdminUser = [1, 2].includes(currentUser?.role?.id ?? 0);

  return (
    <>
      <Card title="Resolved Tickets" value={totalResolvedTickets} type="resolved"
        currentUser={currentUser} />
      <Card title="Pending Tickets" value={totalPendingTickets} type="pending" 
        currentUser={currentUser} />
      <Card title="Total Tickets" value={numberOfTickets} type="tickets" 
        currentUser={currentUser} />
      {isAdminUser && <Card title="Total Users" value={numberOfUsers} type="users" />}
    </>
  );
}

export function Card({
  title,
  value,
  type, currentUser
}: {
  title: string;
  value: number | string;
  type: 'tickets' | 'users' | 'pending' | 'resolved';
  currentUser?: typeof prisma.user
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium text-gray-900">
          {currentUser?.role?.id == 4 && "Your"} {title}
        </h3>
      </div>
      <p
        className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl text-gray-900"
      >
        {value}
      </p>
    </div>
  );
}
