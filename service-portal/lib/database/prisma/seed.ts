import prisma from "@/lib/database/prisma/prisma";

const userRoles: typeof prisma.role[] = [
  { name: "Superadmin" },
  { name: "Admin-Staff" },
  { name: "Service-Technician" },
  { name: "Student" }
];

export async function main() {
  for (const role of userRoles) {
    await prisma.Role.create({
      data: role
    });
  }
}

main();
