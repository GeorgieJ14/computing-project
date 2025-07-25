import Image from 'next/image';
import Search from '@/app/ui-components/search';
import prisma from '@/lib/database/prisma/prisma';

export default async function UsersTable({
  users,
}: {
  users: typeof prisma.user[];
}) {
  return (
    <div className="w-full">
      <h1 className={`mb-8 text-xl md:text-2xl`}>
        Users
      </h1>
      <Search placeholder="Search users..." />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={user.image_url ?? '/file.svg'}
                              className={`${user.image_url ? '' : 'hidden'} rounded-full`}
                              alt={`${user.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p className='text-l font-medium'>{user.name}</p>
                            <p className='text-l font-medium'>
                              User-role: {user.role.name}
                            </p>
                            <p className='text-l font-medium'>
                              Category: {user.category?.name ?? '---'}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Pending</p>
                        <p className="font-medium">{user.total_pending}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Resolved</p>
                        <p className="font-medium">{user.total_resolved}</p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>{user.total_tickets} tickets</p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope='col' className='px-3 py-5 font-medium'>
                      User-role
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Tickets
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Pending
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Resolved
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {users.map((user) => (
                    <tr key={user.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.image_url ?? '/file.svg'}
                            className={`${user.image_url ? '' : 'hidden'} rounded-full`}
                            alt={`${user.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p className='text-l font-medium'>{user.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.role.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.category?.name ?? '---'}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.total_tickets}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.total_pending}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {user.total_resolved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
