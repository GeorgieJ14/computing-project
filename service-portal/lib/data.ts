'use server';

// import postgres from 'postgres';
// import { formatCurrency } from './utils';
import prisma from "@/lib/database/prisma/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
// import { Prisma } from '@prisma/client'
/* import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'; */

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchTickets() {
  try {
    // console.log('Fetching tickets data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prisma.ticket.findMany({
      where: {
        deletedAt: null,
      },
    });
    // sql<Ticket[]>`SELECT * FROM tickets`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('1Database Error:', error);
    // throw new Error('Failed to fetch tickets data.');
    return []; // Return an empty array in case of error
  }
}

export async function fetchLatestTickets() {
  const currentUser = fetchCurrentUser();
  let queryObj1 = {
    where: {
      deletedAt: null,
      user: undefined,
      assignedToUser: undefined
    },
    orderBy: {
      date: Prisma.SortOrder.desc,
    },
    take: 5,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image_url: true,
          email: true,
        },
      },
      attachments: true
    },
  };

  switch (currentUser?.role?.id) {
    case 3:
      queryObj1.where.assignedToUser = {
        id: currentUser.id,
        deletedAt: null
      }
      break;
    case 4:
      queryObj1.where.user = {
        id: currentUser.id,
        deletedAt: null
      }
      break;
    default:
      break;
  }
  try {
    const data = await prisma.ticket.findMany(queryObj1);
    return data;
    
    /* sql<Ticket[]>`
      SELECT tickets.details, users.name, users.image_url, users.email, tickets.id
      FROM tickets
      JOIN users ON tickets.user_id = users.id
      ORDER BY tickets.date DESC
      LIMIT 5`; */
  } catch (error) {
    console.error('2Database Error:', error);
    // throw new Error('Failed to fetch the latest tickets.');
    return []; // Return an empty array in case of error
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const ticketCountPromise = prisma.ticket.count({
      where: {
        deletedAt: null,
      },
    });
    // sql`SELECT COUNT(*) FROM tickets`;
    const userCountPromise = prisma.user.count({
      where: {
        deletedAt: null,
      },
    });
    // sql`SELECT COUNT(*) FROM users`;
    const ticketStatusPromise = prisma.ticket.groupBy({
      by: ['status'],
      _count: {
        _all: true
        // status: true,
      },
      where: {
        status: {
          in: ['resolved', 'pending'],
        },
        deletedAt: null,
      },
    });
    /* sql`SELECT
         SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS "resolved",
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS "pending"
         FROM tickets`; */

    const data = await Promise.all([
      ticketCountPromise,
      userCountPromise,
      ticketStatusPromise,
    ]);
    // console.log(data[2], data[1]);
    const numberOfTickets = Number(data[0] ?? '0');
    const numberOfUsers = Number(data[1] ?? '0');
    const totalResolvedTickets = Number(data[2][1]?._count?._all ?? '0');
    const totalPendingTickets = Number(data[2][0]?._count?._all ?? '0');

    return {
      numberOfUsers,
      numberOfTickets,
      totalResolvedTickets,
      totalPendingTickets,
    };
  } catch (error) {
    console.error('3Database Error:', error);
    // throw new Error('Failed to fetch card data.');

    const numberOfUsers = 0;
    const numberOfTickets = 0;
    const totalResolvedTickets = 0;
    const totalPendingTickets = 0;
    return {
      numberOfUsers,
      numberOfTickets,
      totalResolvedTickets,
      totalPendingTickets,
    };
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredTickets(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUser = fetchCurrentUser();

  let queryObj1 = {
    /* select: undefined,
    omit: undefined, */
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image_url: true,
          role: true
        },
      },
      category: true,
      assignedToUser: {
        select: {
          id: true,
          name: true,
          role: true
        }
      }
    },
    where: {
      deletedAt: null,
      user: {
        id: undefined,
        deletedAt: null,
      },
      OR: undefined,
      assignedToUser: undefined
    },
    orderBy: {
      date: Prisma.SortOrder.desc,
    },
    take: ITEMS_PER_PAGE,
    skip: offset,
  };
  
  switch (currentUser?.role?.id) {
    case 3:
      queryObj1.where.assignedToUser = {
        id: currentUser.id
      }
      break;
    case 4:
      queryObj1.where.user = {
        id: currentUser.id,
        deletedAt: null
      }
      break;
    default:
      break;
  }

  if (query && query.length > 0) {
    queryObj1.where.OR = [
      {
        user: {
          name: {
            contains: query,
            // mode: 'insensitive',
          },
        },
      },
      {
        user: {
          email: {
            contains: query,
            // mode: Prisma.QueryMode.insensitive,
          },
        },
      },
      {
        details: {
          contains: query,
          // mode: 'insensitive',
        },
      },
      /* {
        date: {
          contains: query,
          // mode: 'insensitive',
        },
      }, */
      {
        status: {
          contains: query,
          // mode: 'insensitive',
        },
      },
    ];
  }
  try {
    const tickets = await prisma.ticket.findMany(queryObj1);

    return tickets;
    
    /* sql<TicketsTable[]>`
      SELECT
        tickets.id,
        tickets.details,
        tickets.date,
        tickets.status,
        users.name,
        users.email,
        users.image_url
      FROM tickets
      JOIN users ON tickets.user_id = users.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        tickets.details::text ILIKE ${`%${query}%`} OR
        tickets.date::text ILIKE ${`%${query}%`} OR
        tickets.status ILIKE ${`%${query}%`}
      ORDER BY tickets.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `; */
  } catch (error) {
    console.error('4Database Error:', error);
    // throw new Error('Failed to fetch tickets.');

    return []; // Return an empty array in case of error
  }
}

export async function fetchFilteredCategories(
  /* query: string,
  currentPage: number, */
) {
  // const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
        /* tickets: {
          deletedAt: null,
        }, */
      },
      include: {
        tickets: {
          select: {
            id: true,
            title: true,
            details: true,
            date: true,
            status: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
      // take: ITEMS_PER_PAGE,
      // skip: offset,
    });
    return categories;
  } catch (error) {
    console.error('4catsDatabase Error:', error);
    // throw new Error('Failed to fetch categories.');
    
    return []; // Return an empty array in case of error
  }
}

export async function fetchTicketsPages(query: string) {
  try {
    let data;
    if (query && query.length > 0) {
      data = await prisma.ticket.count({
        where: {
          deletedAt: null,
          user: {
            deletedAt: null,
          },
          OR: [
            {
              user: {
                name: {
                  contains: query,
                  // mode: 'insensitive',
                },
              },
            },
            {
              user: {
                email: {
                  contains: query,
                  // mode: Prisma.QueryMode.insensitive,
                },
              },
            },
            {
              details: {
                contains: query,
                // mode: 'insensitive',
              },
            },
            /* {
              date: {
                contains: query,
                // mode: 'insensitive',
              },
            }, */
            {
              status: {
                contains: query,
                // mode: 'insensitive',
              },
            },
          ],
        },
      });
    } else {
      data = await prisma.ticket.count({
        where: {
          deletedAt: null,
          user: {
            deletedAt: null,
          },
        },
      });
    }

    /* sql`SELECT COUNT(*)
    FROM tickets
    JOIN users ON tickets.user_id = users.id
    WHERE
      users.name ILIKE ${`%${query}%`} OR
      users.email ILIKE ${`%${query}%`} OR
      tickets.details::text ILIKE ${`%${query}%`} OR
      tickets.date::text ILIKE ${`%${query}%`} OR
      tickets.status ILIKE ${`%${query}%`}
  `; */

    const totalPages = Math.ceil(Number(data ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('5Database Error:', error);
    // throw new Error('Failed to fetch total number of tickets.');
    return 0; // Return 0 in case of error
  }
}

export async function fetchCategoryById(id: number) {
  try {
    const data = await prisma.category.findUnique({
      where: {
        id: id,
        deletedAt: null,
        /* user: {
          deletedAt: null,
        } */
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            role: true,
            // image_url: true,
          },
        },
        tickets: true
      },
    });
    return data;
  } catch (error) {
    console.error('6catsDatabase Error:', error);
    // throw new Error('Failed to fetch ticket.');
    return null; // Return null in case of error
  }
}

export async function fetchTicketById(id: number) {
  try {
    const data = await prisma.ticket.findUnique({
      where: {
        id: id,
        deletedAt: null,
        user: {
          deletedAt: null,
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image_url: true,
          },
        },
        attachments: true,
        category: true, // Include the category if needed
        assignedToUser: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
    });

    /* sql<TicketForm[]>`
      SELECT
        tickets.id,
        tickets.user_id,
        tickets.details,
        tickets.status
      FROM tickets
      WHERE tickets.id = ${id};
    `; */

    const ticket = data;
    /* .map((ticket) => ({
      ...ticket,
      // Convert details from cents to dollars
      details: ticket.details / 100,
    })); */

    return ticket;
  } catch (error) {
    console.error('6Database Error:', error);
    // throw new Error('Failed to fetch ticket.');
    return null; // Return null in case of error
  }
}

export async function fetchRoles() {
  try {
    const roles = await prisma.role.findMany();
    return roles;
  } catch (err) {
    console.error('7Database Error:', err);
    // throw new Error('Failed to fetch all roles.');
    return [];
  }
}

export async function fetchUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        role: true,
        category: true
      },
      orderBy: {
        name: 'asc',
      },
    });
    /* sql<UserField[]>`
      SELECT
        id,
        name
      FROM users
      ORDER BY name ASC
    `; */

    return users;
  } catch (err) {
    console.error('7Database Error:', err);
    // throw new Error('Failed to fetch all users.');
    return [];
  }
}

export async function fetchFilteredUsers(query: string) {
  try {
    if (query && query.length > 0) {
      // console.log("Checking: ", query.length);
      const data = await prisma.user.findMany({
        where: {
          deletedAt: null,
          /* tickets: {
            deletedAt: null,
          }, */
          OR: [
            {
              name: {
                contains: query,
                // mode: 'insensitive',
              },
            },
            {
              email: {
                contains: query,
                // mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        },
        include: {
          tickets: {
            select: {
              id: true,
              status: true,
              deletedAt: true,
            },
          },
          role: true,
          category: true
        },
        orderBy: {
          name: 'asc',
        },
      });
      return data;
    }

    const data = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        tickets: {
          select: {
            id: true,
            status: true,
            deletedAt: true,
          },
        },
        role: true,
        category: true
      },
      orderBy: {
        name: 'asc',
      },
    });

    /* sql<UsersTableType[]>`
    SELECT
      users.id,
      users.name,
      users.email,
      users.image_url,
      COUNT(tickets.id) AS total_tickets,
      SUM(CASE WHEN tickets.status = 'pending' THEN 1 ELSE 0 END) AS total_pending,
      SUM(CASE WHEN tickets.status = 'resolved' THEN 1 ELSE 0 END) AS total_resolved
    FROM users
    LEFT JOIN tickets ON users.id = tickets.user_id
    WHERE
      users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`}
    GROUP BY users.id, users.name, users.email, users.image_url
    ORDER BY users.name ASC
    `; */

    // const users = data;
    /* .map((user) => ({
      ...user,
      total_pending: user.total_pending,
      total_resolved: user.total_resolved,
    })); */

    return data;
  } catch (err) {
    console.error('8Database Error:', err);
    // throw new Error('Failed to fetch user table.');
    return []; // Return an empty array in case of error
  }
}

export async function fetchCurrentUser() {
  try {
    const session = await auth();
    if (!session?.user) {
      return null; // No user is authenticated
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? undefined,
        deletedAt: null,
      },
      include: {
        role: true,
        /* tickets: {
          select: {
            id: true,
            status: true,
            deletedAt: true,
          },
        }, */
      },
    });

    return user;
  } catch (error) {
    console.error('9Database Error:', error);
    // throw new Error('Failed to fetch current user.');
    return null; // Return null in case of error
  }
}

export async function fetchUserMenuLinks() {
  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
    { name: 'Tickets', href: '/dashboard/tickets', icon: 'DocumentDuplicateIcon' },
    { name: 'Categories', href: '/dashboard/categories', icon: 'DocumentDuplicateIcon' },
    { name: 'Users', href: '/dashboard/users', icon: 'UserGroupIcon' },
  ];
  const currentUser = await fetchCurrentUser();
  switch (currentUser?.role?.id) {
    case 3: // Service Technician
      links.splice(2, 2); // Remove 'Categories' and 'Users'
      // links.splice(0, 1);
      break;
    case 4: // Student
      links.splice(2, 2); // Remove 'Tickets', 'Categories', and 'Users'
      // links.splice(0, 1);
      break;
    default:
      break;
  }
  return links;
}
