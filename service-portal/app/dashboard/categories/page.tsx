import { TicketsTableSkeleton } from '@/app/ui-components/skeletons';
import { Suspense } from 'react';
// import { fetchCategoriesPages } from '@/lib/data';
import { Metadata } from 'next';
import Table from '@/app/ui-components/categories/table';
import { CreateCategory } from '@/app/ui-components/categories/buttons';

export const metadata: Metadata = {
  title: 'Categories',
};

export default async function Page(/* props: {
  searchParams?: Promise<{
    page?: string;
  }>;
} */) {
 /*  const searchParams = await props.searchParams;
  // const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1; */

  // const totalPages = await fetchCategoriesPages();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Categories</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* <Search placeholder="Search categories..." /> */}
        <CreateCategory />
      </div>
      <Suspense fallback={<TicketsTableSkeleton />}>
        <Table />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
