import { test } from 'node:test';
import assert from 'node:assert/strict';
import {choosePlace, decide, initial, options, pages, restore, sceneCaption, type Place} from '../lib/stories.ts';
for (const location of ['bakery','park','station'] as Place[]) {
 test(`${location}: every branch produces a complete eight-page adventure`,()=>{
  function walk(s: ReturnType<typeof choosePlace>) { if(s.decisions.length===4){const book=pages(s);assert.equal(book.length,8);assert.ok(book.join(' ').includes(s.event));for(const d of s.decisions)assert.ok(book.join(' ').includes(d.text[0].toLowerCase()+d.text.slice(1))||book.join(' ').includes(d.text));assert.ok(s.outcome);return;}for(const o of options(s)){const next=decide(s,o);assert.notEqual(sceneCaption(next),sceneCaption(s));walk(next);} }
  walk(choosePlace(location));
 });
}
test('first decision influences subsequent options',()=>{const s=choosePlace('bakery');assert.notDeepEqual(options(decide(s,{id:'ask',text:'Ask'})),options(decide(s,{id:'follow',text:'Follow'})));});
test('custom ideas are preserved in the book and restored progress',()=>{let s=choosePlace('park');s=decide(s,{id:'custom',text:'Make a map of the park'});while(s.decisions.length<4)s=decide(s,options(s)[0]);assert.match(pages(s).join(' '),/Make a map of the park/);assert.deepEqual(restore(JSON.parse(JSON.stringify(s))),s);assert.deepEqual(decide(s,{id:'extra',text:'Extra'}),s);});
test('invalid saved progress and incomplete stories are rejected',()=>{assert.equal(restore(null),null);assert.equal(restore({...initial,location:'moon'}),null);assert.equal(restore({...choosePlace('park'),decisions:[{id:4,text:'bad'}]}),null);assert.deepEqual(pages(initial),[]);assert.deepEqual(decide(initial,{id:'a',text:'A'}),initial);});
