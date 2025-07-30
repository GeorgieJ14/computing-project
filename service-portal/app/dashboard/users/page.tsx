import { fetchFilteredUsers } from '@/lib/data';
import UsersTable from '@/app/ui-components/users/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  const users = await fetchFilteredUsers(query);

  return (
    <main>
      <UsersTable users={users} />
    </main>
  );
}
