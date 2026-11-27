'use client';
import { useMemo } from 'react';
import { authorNames, bookTitle, world, type Story } from '@/lib/story/engine';
import { coverScene } from '@/lib/story/compose';
import { Stage } from '../art/Stage';
import { BrandMark } from '../ui/marks';

export const COVER_CLOTH: Record<string, string> = { bakery: '#b65d43', park: '#2f4a3b', station: '#4f6b77' };

export function byline(s: Story) {
  const { child, grownup } = authorNames(s);
  return `${child} & ${grownup}`;
}

/** A real book cover: cloth, spine, a pasted-on illustration plate, title and byline. */
export function Cover({ story, still = true, className = '' }: { story: Story; still?: boolean; className?: string }) {
  const place = world(story).place ?? 'park';
  const sc = useMemo(() => coverScene(story), [story]);
  const title = bookTitle(story);
  return (
    <div className={`cover ${className}`} style={{ ['--cloth' as string]: COVER_CLOTH[place] }} data-cover>
      <div className="cover-spine" />
      <div className="cover-inner">
        <h2 className="cover-title" style={{ fontSize: title.length > 28 ? '9.2cqw' : title.length > 20 ? '10.5cqw' : '12cqw' }}>{title}</h2>
        <div className="cover-plate">
          <Stage scene={sc} still={still} />
        </div>
        <p className="cover-by">by {byline(story)}</p>
        <p className="cover-imprint"><BrandMark size={18} /> <span>Crafta</span></p>
      </div>
    </div>
  );
}
