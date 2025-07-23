'use client';

// import { fetchUserMenuLinks } from '@/lib/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
    UserGroupIcon, HomeIcon, DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.



export default function NavLinks({menuLinks}: {menuLinks: {
  name: string, href: string, icon: string
}[]}) {
  const pathname = usePathname();
  // const links = await fetchUserMenuLinks();

  return (
    <>
      {menuLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'text-gray-900 flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <HomeIcon className={clsx('w-6', {'hidden': LinkIcon != 'HomeIcon'})} />
            <DocumentDuplicateIcon className={clsx('w-6', {'hidden': LinkIcon != 'DocumentDuplicateIcon'})} />
            <UserGroupIcon className={clsx('w-6', {'hidden': LinkIcon != 'UserGroupIcon'})} />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
