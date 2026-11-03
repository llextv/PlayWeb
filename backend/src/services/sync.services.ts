import { createHash, randomUUID } from "node:crypto";
import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

type PlaytimeEntry = { userId: string; seconds: number };
type CatalogEntry = { key: string; title: string; description: string; rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" };
type UnlockEntry = { userId: string; key: string; unlockedAt: string };

type Failure = { success: false; status: number; error: string };

const toHours = (seconds: number) => (seconds / 3600).toFixed(2);

const successId = (gameId: string, key: string) => {
  const hash = createHash("sha256").update(`success:${gameId}:${key}`).digest("hex");
  const variant = ((parseInt(hash[16], 16) & 3) | 8).toString(16);
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-${variant}${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
};

const findGame = (gameRef: string) => prisma.game.findFirst({
  where: { OR: [{ id: gameRef }, { slug: gameRef }, { name: gameRef }] },
  select: { id: true },
});

const knownUserIds = async (userIds: string[]) => {
  const rows = await prisma.user.findMany({ where: { id: { in: [...new Set(userIds)] } }, select: { id: true } });
  return rows.map((row) => row.id);
};

const syncPlaytime = async (gameRef: string, entries: PlaytimeEntry[]): Promise<{ success: true; updated: number } | Failure> => {
  try {
    const game = await findGame(gameRef);
    if (!game) return { success: false, status: 404, error: "Game not found" };

    const latest = new Map(entries.map((entry) => [entry.userId, entry.seconds]));
    const known = await knownUserIds([...latest.keys()]);
    if (known.length === 0) return { success: true, updated: 0 };

    const values = known.map((id) => Prisma.sql`(${randomUUID()}, ${id}, ${game.id}, 'JOINED', ${toHours(latest.get(id) || 0)}, NOW(3))`);
    await prisma.$executeRaw`INSERT INTO \`GameUser\` (\`id\`, \`userId\`, \`gameId\`, \`status\`, \`playedHours\`, \`joinedAt\`)
      VALUES ${Prisma.join(values)}
      ON DUPLICATE KEY UPDATE \`playedHours\` = VALUES(\`playedHours\`)`;
    return { success: true, updated: known.length };
  } catch (error) {
    console.error("Playtime sync failed:", error);
    return { success: false, status: 500, error: "Internal Server Error" };
  }
};

const syncSuccesses = async (
  gameRef: string,
  catalog: CatalogEntry[] | undefined,
  unlocks: UnlockEntry[],
): Promise<{ success: true; catalog: number; unlocked: number } | Failure> => {
  try {
    const game = await findGame(gameRef);
    if (!game) return { success: false, status: 404, error: "Game not found" };

    if (catalog?.length) {
      const values = catalog.map((entry) => Prisma.sql`(${successId(game.id, entry.key)}, ${game.id}, ${entry.title}, ${entry.description || null}, ${entry.rarity}, NOW(3))`);
      await prisma.$executeRaw`INSERT INTO \`Success\` (\`id\`, \`gameId\`, \`title\`, \`description\`, \`rarity\`, \`createdAt\`)
        VALUES ${Prisma.join(values)}
        ON DUPLICATE KEY UPDATE \`title\` = VALUES(\`title\`), \`description\` = VALUES(\`description\`), \`rarity\` = VALUES(\`rarity\`)`;
    }

    if (unlocks.length === 0) return { success: true, catalog: catalog?.length || 0, unlocked: 0 };

    const known = await knownUserIds(unlocks.map((unlock) => unlock.userId));
    if (known.length === 0) return { success: true, catalog: catalog?.length || 0, unlocked: 0 };

    const gameUserValues = known.map((id) => Prisma.sql`(${randomUUID()}, ${id}, ${game.id}, 'JOINED', '0', NOW(3))`);
    await prisma.$executeRaw`INSERT INTO \`GameUser\` (\`id\`, \`userId\`, \`gameId\`, \`status\`, \`playedHours\`, \`joinedAt\`)
      VALUES ${Prisma.join(gameUserValues)}
      ON DUPLICATE KEY UPDATE \`userId\` = \`userId\``;

    const [gameUsers, successes] = await Promise.all([
      prisma.gameUser.findMany({ where: { gameId: game.id, userId: { in: known } }, select: { id: true, userId: true } }),
      prisma.success.findMany({
        where: { gameId: game.id, id: { in: [...new Set(unlocks.map((unlock) => successId(game.id, unlock.key)))] } },
        select: { id: true },
      }),
    ]);
    const gameUserOf = new Map(gameUsers.map((row) => [row.userId, row.id]));
    const existing = new Set(successes.map((row) => row.id));

    const data = unlocks.flatMap((unlock) => {
      const gameUserId = gameUserOf.get(unlock.userId);
      const id = successId(game.id, unlock.key);
      if (!gameUserId || !existing.has(id)) return [];
      return [{ gameUserId, successId: id, earnedAt: new Date(unlock.unlockedAt) }];
    });
    const created = data.length ? await prisma.gameUserSuccess.createMany({ data, skipDuplicates: true }) : { count: 0 };
    return { success: true, catalog: catalog?.length || 0, unlocked: created.count };
  } catch (error) {
    console.error("Successes sync failed:", error);
    return { success: false, status: 500, error: "Internal Server Error" };
  }
};

export default { syncPlaytime, syncSuccesses };
