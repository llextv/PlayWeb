import { prisma } from "../config/prisma.js";

export const nameKey = (name: string) => name.trim().toLowerCase();

const isNameBanned = async (name?: string | null) => {
  if (!name) return false;
  const banned = await prisma.bannedName.findUnique({ where: { nameKey: nameKey(name) } });
  return !!banned;
};

const banName = async (name: string, bannedBy?: string | null) => {
  const key = nameKey(name);
  return prisma.bannedName.upsert({
    where: { nameKey: key },
    create: { nameKey: key, name: name.trim(), bannedBy: bannedBy || null },
    update: {},
  });
};

const unbanName = async (name: string) => {
  return prisma.bannedName.deleteMany({ where: { nameKey: nameKey(name) } });
};

export default { isNameBanned, banName, unbanName };
