import pool from '@config/db';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function buildGroups(counts: number[]): string[][] {
  return counts.map((count, idx) => {
    const prefix = LETTERS[idx];
    return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
  });
}

function pickIndexCombos(n: number, k: number): number[][] {
  const res: number[][] = [];
  function extend(start: number, path: number[]) {
    if (path.length === k) {
      res.push([...path]);
      return;
    }
    for (let i = start; i < n; i++) {
      path.push(i);
      extend(i + 1, path);
      path.pop();
    }
  }
  extend(0, []);
  return res;
}

function cartesianProduct<T>(arrs: T[][]): T[][] {
  return arrs.reduce<T[][]>((acc, arr) => acc.flatMap((p) => arr.map((v) => [...p, v])), [[]]);
}

export default class CombinationController {
  static async generateCombinations(items: number[], length: number) {
    const groups = buildGroups(items);
    if (length > groups.length) return [];

    const typeChoices = pickIndexCombos(groups.length, length);
    let all: string[][] = [];
    for (const idxs of typeChoices) {
      const chosenGroups = idxs.map((i) => groups[i]);
      all = all.concat(cartesianProduct(chosenGroups));
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [ins] = await conn.query('INSERT INTO combinations (`items`) VALUES (?)', [
        JSON.stringify(all),
      ]);
      const id = (ins as any).insertId;

      await conn.query('INSERT INTO responses (combination_id) VALUES (?)', [id]);

      await conn.commit();

      return { id, combination: all };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }
}
