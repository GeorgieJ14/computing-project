import Form from '@/app/ui-components/categories/edit-form';
import Breadcrumbs from '@/app/ui-components/tickets/breadcrumbs';
import { fetchCategoryById, fetchUsers } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Category',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);
  const [category, users] = await Promise.all([
    fetchCategoryById(id),
    fetchUsers(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categories', href: '/dashboard/categories' },
          {
            label: 'Edit Category',
            href: `/dashboard/categories/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form category={category} users={users} />
    </main>
  );
}
