import { fetchUsers } from '@/lib/data';
import Form from '@/app/ui-components/categories/create-form';
import Breadcrumbs from '@/app/ui-components/tickets/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Category',
};

export default async function Page() {
  const users = await fetchUsers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categories', href: '/dashboard/categories' },
          {
            label: 'Create Category',
            href: '/dashboard/categories/create',
            active: true,
          },
        ]}
      />
      <Form users={users} />
    </main>
  );
}
