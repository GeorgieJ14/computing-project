'use server';

import { z } from 'zod';
// import postgres from 'postgres';
import prisma from '@/lib/database/prisma/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  userId: z.string({
    invalid_type_error: 'Please select a user.',
  }),
  details: z.string({
    message: 'Please enter details about your complaint / request.',
  }),
  status: z.enum(['pending', 'resolved'], {
    invalid_type_error: 'Please select a ticket status.',
  }),
  date: z.string(),
});

const CreateTicket = FormSchema.omit({ id: true, date: true });
const UpdateTicket = FormSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    userId?: string[];
    details?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createTicket(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateTicket.safeParse({
    userId: formData.get('userId'),
    details: formData.get('details'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Ticket.',
    };
  }

  // Prepare data for insertion into the database
  const { userId, details, status } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await prisma.ticket.create({
      data: {
        userId,
        details,
        status,
        date,
      },
    });
    /* sql`
      INSERT INTO tickets (user_id, details, status, date)
      VALUES (${userId}, ${details}, ${status}, ${date})
    `; */
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Ticket.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Revalidate the cache for the tickets page and redirect the user.
  revalidatePath('/dashboard/tickets');
  redirect('/dashboard/tickets');
}

export async function updateTicket(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateTicket.safeParse({
    userId: formData.get('userId'),
    details: formData.get('details'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Ticket.',
    };
  }

  const { userId, details, status } = validatedFields.data;

  try {
    await prisma.ticket.update({
      where: { id },
      data: {
        userId,
        details,
        status,
      },
    });
    /* sql`
      UPDATE tickets
      SET user_id = ${userId}, details = ${details}, status = ${status}
      WHERE id = ${id}
    `; */
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Ticket.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  revalidatePath('/dashboard/tickets');
  redirect('/dashboard/tickets');
}

export async function deleteTicket(id: string) {
  // await prisma.ticket.delete({
  await prisma.ticket.update({
    where: { id },
    data: { deletedAt: new Date().toISOString().split('T')[0] },
  });

  // sql`DELETE FROM tickets WHERE id = ${id}`;
  revalidatePath('/dashboard/tickets');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
