// import postgres from 'postgres';
// import { formatCurrency } from './utils';
import prisma from "@/lib/database/prisma/prisma";

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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tickets data.');
  }
}

export async function fetchLatestTickets() {
  try {
    const data = await prisma.ticket.findMany({
      orderBy: {
        date: 'desc',
      },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
      where: {
        deletedAt: null,
      },
    });
    /* sql<Ticket[]>`
      SELECT tickets.details, users.name, users.image_url, users.email, tickets.id
      FROM tickets
      JOIN users ON tickets.user_id = users.id
      ORDER BY tickets.date DESC
      LIMIT 5`; */

    const latestTickets = data;
    /* .map((ticket) => ({
      ...ticket,
      details: ticket.details,
    })); */
    return latestTickets;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest tickets.');
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
        status: true,
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

    const numberOfTickets = Number(data[0].count ?? '0');
    const numberOfUsers = Number(data[1].count ?? '0');
    const totalResolvedTickets = data[2][0].resolved ?? '0';
    const totalPendingTickets = data[2][0].pending ?? '0';

    return {
      numberOfUsers,
      numberOfTickets,
      totalResolvedTickets,
      totalPendingTickets,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredTickets(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const tickets = await prisma.ticket.findMany({
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
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            details: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            date: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            status: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

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

    return tickets;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tickets.');
  }
}

export async function fetchTicketsPages(query: string) {
  try {
    const data = await prisma.ticket.count({
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
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            details: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            date: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            status: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

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

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of tickets.');
  }
}

export async function fetchTicketById(id: string) {
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
            name: true,
            email: true,
            image_url: true,
          },
        },
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

    return ticket[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ticket.');
  }
}

export async function fetchUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
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
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

export async function fetchFilteredUsers(query: string) {
  try {
    const data = await prisma.user.findMany({
      where: {
        deletedAt: null,
        tickets: {
          deletedAt: null,
        },
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        tickets: {
          select: {
            id: true,
            status: true,
          },
        },
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

    const users = data;
    /* .map((user) => ({
      ...user,
      total_pending: user.total_pending,
      total_resolved: user.total_resolved,
    })); */

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch user table.');
  }
}
