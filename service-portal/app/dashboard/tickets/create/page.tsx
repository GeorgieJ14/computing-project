import { fetchCurrentUser, fetchUsers } from '@/lib/data';
import Form from '@/app/ui-components/tickets/create-form';
import Breadcrumbs from '@/app/ui-components/tickets/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Ticket',
};

export default async function Page() {
  const users = await fetchUsers();
  const currentUser = await fetchCurrentUser();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tickets', href: '/dashboard/tickets' },
          {
            label: 'Create Ticket',
            href: '/dashboard/tickets/create',
            active: true,
          },
        ]}
      />
      <Form users={users} currentUser={currentUser}/>
    </main>
  );
}
