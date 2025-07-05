import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { fetchCardData } from '@/lib/data';

const iconMap = {
  resolved: BanknotesIcon,
  users: UserGroupIcon,
  pending: ClockIcon,
  tickets: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfTickets,
    numberOfUsers,
    totalResolvedTickets,
    totalPendingTickets,
  } = await fetchCardData();

  return (
    <>
      <Card title="Resolved" value={totalResolvedTickets} type="resolved" />
      <Card title="Pending" value={totalPendingTickets} type="pending" />
      <Card title="Total Tickets" value={numberOfTickets} type="tickets" />
      <Card
        title="Total Users"
        value={numberOfUsers}
        type="users"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'tickets' | 'users' | 'pending' | 'resolved';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl"
      >
        {value}
      </p>
    </div>
  );
}
