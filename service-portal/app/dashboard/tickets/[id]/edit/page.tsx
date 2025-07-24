import Form from '@/app/ui-components/tickets/edit-form';
import Breadcrumbs from '@/app/ui-components/tickets/breadcrumbs';
import { fetchTicketById, fetchUsers } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Ticket',
};

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const id = params.id;
  const [ticket, users] = await Promise.all([
    fetchTicketById(id),
    fetchUsers(),
  ]);

  if (!ticket) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tickets', href: '/dashboard/tickets' },
          {
            label: 'Edit Ticket',
            href: `/dashboard/tickets/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form ticket={ticket} users={users} />
    </main>
  );
}
