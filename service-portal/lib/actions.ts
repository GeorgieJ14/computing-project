'use server';

import { z } from 'zod';
// import postgres from 'postgres';
import bcrypt from 'bcrypt';
import prisma from '@/lib/database/prisma/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
// import { signIn } from 'next-auth/react';
import { AuthError, CredentialsSignin } from 'next-auth';
/* import AdapterError from 'next-auth';
import EmailSignInError from 'next-auth';
import SignInError from 'next-auth';
import Verification from 'next-auth'; */
import { writeFile } from 'fs/promises';
import path from 'path';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  userId: z.string({
    invalid_type_error: 'Please select a user.',
  }),
  title: z.string(),
  details: z.string({
    message: 'Please enter details about your complaint / request.',
  }),
  tags: z.string(),
  name: z.string({
    message: 'Please enter category name.',
  }),
  description: z.string({
    message: 'Please enter category-details.',
  }),
  status: z.enum(['pending', 'resolved'], {
    invalid_type_error: 'Please select a ticket status.',
  }),
  date: z.string(),
  password: z.string(), //.min(6)
  email: z.string(), //.email(),
  roleId: z.number(),
  // attachments: z.file().optional(),
});

const CreateTicket = FormSchema.pick({ userId: true, title: true, details: true, tags: true, status: true });
const CreateCategory = FormSchema.pick({ name: true, description: true });
const UpdateCategory = FormSchema.pick({ name: true, description: true });
const UpdateTicket = FormSchema.pick({ userId: true, title: true, details: true, tags: true, status: true });
// const CreateUser = FormSchema.pick({ name: true, password: true, email: true, roleId: true });

export type State = {
  errors?: {
    userId?: string[];
    title?: string[];
    details?: string[];
    tags?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type CategoryState = {
  errors?: {
    name?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createTicket(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateTicket.safeParse({
    userId: formData.get('userId'),
    title: formData.get('title'),
    details: formData.get('details'),
    tags: formData.get('tags'),
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
  const { userId, title, details, tags, status } = validatedFields.data;
  const date = new Date(); // .toISOString().split('T')[0];
  const files = formData.getAll('attachments');

  const filesArray1 = Array.isArray(files) ? await Promise.all(
    files?.filter(async (file1) => file1.size > 0).map(async (file1) => {
      if (file1.size) {
        const fileObj1 = {
          userId: userId,
          fileName: file1.name.replaceAll(' ', '_'),
          size: file1.size,
          type: 'image',
          contentType: file1.type,
        };
        await writeFile(
          path.join(process.cwd(), 'public/file_uploads/ticket_images', fileObj1.fileName),
          Buffer.from(await file1?.arrayBuffer()),
        );
        return fileObj1;
      }
  })) : [];


  // Insert data into the database
  try {
    // console.log(files);
    await prisma.ticket.create({
      data: {
        userId: userId,
        title: title,
        details: details,
        tags: tags,
        status: status,
        date: date,
        attachments: {
          create: filesArray1
        }
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

export async function createCategory(prevState: CategoryState, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateCategory.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    // status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Category.',
    };
  }

  // Prepare data for insertion into the database
  const { name, description } = validatedFields.data;
  // const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await prisma.category.create({
      data: {
        name: name,
        description: description,
        users: {
          connect: Array.from(formData.getAll('users') as string[]).map((userId) => ({
            id: userId,
          })),
        },
      },
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Category.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
  
  // Revalidate the cache for the categories page and redirect the user.
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}


export async function updateCategory(
  id: number,
  prevState: CategoryState,
  formData: FormData,
) {
  const validatedFields = UpdateCategory.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Category.',
    };
  }

  const { name, description } = validatedFields.data;

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        users: {
          set: Array.from(formData.getAll('users') as string[]).map((userId) => ({
            id: userId,
          })),
        },
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Category.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
  
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export async function updateTicket(
  id: number,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateTicket.safeParse({
    userId: formData.get('userId'),
    title: formData.get('title'),
    details: formData.get('details'),
    tags: formData.get('tags'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Ticket.',
    };
  }

  const { userId, title, details, tags, status } = validatedFields.data;

  try {
    await prisma.ticket.update({
      where: { id },
      data: {
        userId,
        title,
        details,
        tags,
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

export async function deleteTicket(id: number) {
  // await prisma.ticket.delete({
  await prisma.ticket.update({
    where: { id },
    data: { deletedAt: new Date().toISOString().split('T')[0] },
  });

  // sql`DELETE FROM tickets WHERE id = ${id}`;
  revalidatePath('/dashboard/tickets');
}

export async function deleteCategory(id: number) {
  // await prisma.category.delete({
  await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date().toISOString().split('T')[0] },
  });

  // sql`DELETE FROM categories WHERE id = ${id}`;
  revalidatePath('/dashboard/categories');
}

export async function authenticate(
  prevState: string | undefined,
  formData: Promise<FormData>,
) {
  try {
    const formData1 = await formData;
    /*formData1.set('username', formData1.get('email') as string);
    formData1.set('password', formData1.get('1_password') as string); */
    console.log(formData1.get("email"), 'here-moreinfo');//, error instanceof (Error) ? error.cause + ' -here-123- ' + error.message : 'Unknown error');
    // console.log(formData1.get("username"));
    console.log(formData1.get("password"));
    // formData1.set('redirect', false);
    const result = await signIn('credentials', {
      email: formData1.get('email') as string,
      password: formData1.get('password') as string,
      // callbackUrl:,
      redirectTo: formData1.get('redirectTo') as string || '/dashboard',
      redirect: false,
    });

    if (result?.error) {
      console.error('Authentication error: ', result.error);
      return 'Invalid credentials. Please try again.';
    }

    console.log('Authenticating user...');
    console.log(result);
    // revalidatePath('/dashboard');
    // redirect('/dashboard');
  } catch (error) {
    /*return 'Invalid credentials. Please try again.'; */
    if (error instanceof AuthError || error instanceof CredentialsSignin
    ) {
      console.log('Authenticating user error...', error.type);
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    /* if (error instanceof AdapterError) {
      // console.log("AdapterError1 ", error.message);
    } else if (error instanceof EmailSignInError) {
      // console.log("EmailSignInError1 ", error.message);
    } else if (error instanceof SignInError) {
      // console.log("SignInError1 ", error.message);
    } else if (error instanceof Verification) {
      // console.log("Verification1 ", error.message); */
    if (error instanceof Error) {
      console.log(error.message);
      console.log(error.cause);
      if (error.message == "NEXT_REDIRECT" ||
        error.message.includes('Cannot read properties of undefined ')
      ) {
        redirect('/dashboard');
      }

      console.log(error.message, "Error1");
      console.log(error.cause);
      // revalidatePath('/dashboard');
      return 'Invalid credentials. Please try again.';
    }

    // console.log('12After switch-case user-error...', error instanceof AuthError ? error.type : 'Unknown type');
    throw error;
  }
}

export async function registerUser(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await prisma.user.create({
      data: {
        name: formData.get('fullName') as string,
        email: formData.get('regEmail') as string,
        password: await bcrypt.hash(formData.get('regPassword') as string, 10),
        roleId: parseInt(formData.get('userRole') as string),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Failed to register user.';
  }
  formData.set('email', formData.get('regEmail') as string);
  formData.set('password', formData.get('regPassword') as string);
  await authenticate(prevState, formData);
  // revalidatePath('/dashboard');
  // redirect('/dashboard');
}

/* export async function huggingFaceApi(tickets) {
  return tickets.map(ticket => ({
    id: ticket.id,
    category: ticket.category,

  }));
} */
