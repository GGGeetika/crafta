/**
 * The hero of every Crafta book is the little author, drawn from a small set of
 * hand-made parts (no photos, no generated faces). Maya is the default hero.
 */

export const SKINS = ['deep', 'brown', 'tan', 'olive', 'fair'] as const;
export const HAIRS = ['puffs', 'curls', 'braids', 'bob', 'short'] as const;
export const HAIR_COLORS = ['black', 'brown', 'auburn', 'blond'] as const;
export const COATS = ['ochre', 'terracotta', 'blue', 'green'] as const;
export const PRONOUNS = ['she', 'he', 'they'] as const;

export type SkinId = (typeof SKINS)[number];
export type HairId = (typeof HAIRS)[number];
export type HairColorId = (typeof HAIR_COLORS)[number];
export type CoatId = (typeof COATS)[number];
export type Pronoun = (typeof PRONOUNS)[number];

export type HeroLook = { skin: SkinId; hair: HairId; hairColor: HairColorId; coat: CoatId; glasses: boolean };
export type Hero = { name: string; pronoun: Pronoun; look: HeroLook };

export const MAYA_LOOK: HeroLook = { skin: 'brown', hair: 'puffs', hairColor: 'black', coat: 'ochre', glasses: false };
export const MAYA: Hero = { name: 'Maya', pronoun: 'she', look: MAYA_LOOK };

export const COAT_WORD: Record<CoatId, string> = { ochre: 'yellow', terracotta: 'red', blue: 'blue', green: 'green' };

const FORMS: Record<Pronoun, { sub: string; obj: string; pos: string }> = {
  she: { sub: 'she', obj: 'her', pos: 'her' },
  he: { sub: 'he', obj: 'him', pos: 'his' },
  they: { sub: 'they', obj: 'them', pos: 'their' },
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/**
 * Fill hero tokens in story text:
 * {N} name · {N’s} possessive · {sub}/{Sub} she · {obj} her · {pos}/{Pos} her (possessive) · {coat} colour word.
 */
export function heroize(text: string, h: Hero): string {
  const f = FORMS[h.pronoun];
  return text
    .replace(/\{N’s\}/g, `${h.name}’s`)
    .replace(/\{N\}/g, h.name)
    .replace(/\{sub\}/g, f.sub).replace(/\{Sub\}/g, cap(f.sub))
    .replace(/\{obj\}/g, f.obj)
    .replace(/\{pos\}/g, f.pos).replace(/\{Pos\}/g, cap(f.pos))
    .replace(/\{coat\}/g, COAT_WORD[h.look.coat]);
}

/** Rebuild a hero from untrusted data; anything unrecognised falls back to Maya’s look. */
export function restoreHero(v: unknown, clean: (s: string) => string): Hero {
  if (!v || typeof v !== 'object') return MAYA;
  const h = v as Partial<Hero> & { look?: Partial<HeroLook> };
  const l: Partial<HeroLook> = h.look ?? {};
  const pick = <T extends string>(list: readonly T[], x: unknown, d: T): T => (list.includes(x as T) ? (x as T) : d);
  const name = typeof h.name === 'string' && clean(h.name) ? clean(h.name) : 'Maya';
  return {
    name,
    pronoun: pick(PRONOUNS, h.pronoun, 'she'),
    look: {
      skin: pick(SKINS, l.skin, MAYA_LOOK.skin), hair: pick(HAIRS, l.hair, MAYA_LOOK.hair), hairColor: pick(HAIR_COLORS, l.hairColor, MAYA_LOOK.hairColor),
      coat: pick(COATS, l.coat, MAYA_LOOK.coat), glasses: l.glasses === true,
    },
  };
}
