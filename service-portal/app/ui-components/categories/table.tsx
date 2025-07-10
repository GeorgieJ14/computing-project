// import Image from 'next/image';
import { UpdateCategory, DeleteCategory } from '@/app/ui-components/categories/buttons';
// import CategoryStatus from '@/app/ui-components/categories/status';
// import { formatDateToLocal } from '@/lib/utils';
// formatCurrency
import { fetchFilteredCategories } from '@/lib/data';
import prisma from '@/lib/database/prisma/prisma';

export default async function CategoriesTable(/* {
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
} */) {
  const categories: typeof prisma.category[] = await fetchFilteredCategories();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {/* <Image
                        src={category.attachments ? '/' + category.attachments[0].fileName : '/file.svg'}
                        className={`${category.attachments ? '' : 'hidden'} mr-2 rounded-full`}
                        width={28}
                        height={28}
                        alt={`${category.title}'s picture`}
                      /> */}
                      <p>{category.name}</p>
                    </div>
                    {/* <p className="text-sm text-gray-500">{formatDateToLocal(category.date)}</p> */}
                  </div>
                  {/* <CategoryStatus status={category.status} /> */}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {category.description}
                    </p>
                    {/* <p>{formatDateToLocal(category.date)}</p> */}
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCategory id={category.id} />
                    <DeleteCategory id={category.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                {/* <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th> */}
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                {/* <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th> */}
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {categories?.map((category) => (
                <tr
                  key={category.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/* <Image
                        src={category.attachments ? '/' + category.attachments[0].fileName : '/file.svg'}
                        className={`${category.attachments ? '' : 'hidden'} rounded-full`}
                        width={28}
                        height={28}
                        alt={`${category.title}'s picture`}
                      /> */}
                      <p>{category.name}</p>
                    </div>
                  </td>
                  {/* <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(category.date)}
                  </td> */}
                  <td className="whitespace-nowrap px-3 py-3">
                    {category.description}
                  </td>
                  {/* <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(category.date)}
                  </td> */}
                  {/* <td className="whitespace-nowrap px-3 py-3">
                    <CategoryStatus status={category.status} />
                  </td> */}
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateCategory id={category.id} />
                      <DeleteCategory id={category.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
