export type Place = 'bakery' | 'park' | 'station';
export type Decision = { id: string; text: string };
export type Adventure = { character: 'Maya'; location: Place | null; event: string; decisions: Decision[]; outcome: string };
export const initial: Adventure = { character: 'Maya', location: null, event: '', decisions: [], outcome: '' };
export const places = { bakery: { name: 'The neighborhood bakery', short: 'Bakery', event: 'A little dog has slipped out of the bakery with a blue ribbon trailing behind!', object: 'a blue ribbon' }, park: { name: 'The sunny park', short: 'Park', event: 'A gust of wind carries a bright red kite into a tree!', object: 'a red kite' }, station: { name: 'The train station', short: 'Station', event: 'A small striped suitcase is sitting all alone on the platform!', object: 'a striped suitcase' } };
export function choosePlace(location: Place): Adventure { return {...initial, location, event: places[location].event}; }
export function options(state: Adventure): Decision[] {
 const place = state.location;
 switch(state.decisions.length) {
 case 0: return place==='bakery'?[{id:'follow',text:'Follow the little dog'},{id:'ask',text:'Ask the baker for help'}]:place==='park'?[{id:'follow',text:'Follow the kite’s string'},{id:'ask',text:'Ask the gardener for help'}]:[{id:'follow',text:'Look for a luggage tag'},{id:'ask',text:'Ask the station helper'}];
 case 1: return state.decisions[0].id==='ask'?[{id:'team',text:'Make a plan together'},{id:'listen',text:'Listen for a clue'}]:[{id:'clue',text:'Look a little closer'},{id:'team',text:'Invite a neighbor to help'}];
 case 2: return state.decisions[1].id==='team'?[{id:'together',text:'Work together, one step at a time'},{id:'kind',text:'Encourage our new friend'}]:[{id:'together',text:'Share the clue with a neighbor'},{id:'kind',text:place==='bakery'?'Offer the dog some water':place==='park'?'Find the child who lost the kite':'Find the worried traveler'}];
 default: return [{id:'celebrate',text:place==='bakery'?'Celebrate with the baker':place==='park'?'Fly the kite together':'Wave goodbye to our new friend'},{id:'remember',text:'Draw a picture of our adventure'}];
 }
}
export function decide(state: Adventure, decision: Decision): Adventure { if(!state.location || state.decisions.length>=4) return state; const decisions=[...state.decisions,decision]; return {...state, decisions, outcome:decisions.length===4?decision.text:''}; }
export function sceneCaption(s: Adventure): string {
 if(!s.location) return 'A whole neighborhood of possibilities.';
 const n=s.decisions.length;
 if(n===0) return s.event;
 if(n===1) return s.decisions[0].id==='ask'?'A friendly neighbor joins Maya. Two heads are better than one!':'Maya spots a trail of clues. Where could they lead?';
 if(n===2) return s.decisions[1].id==='team'?'A new friend joins the adventure. They have a plan!':'A golden clue catches Maya’s eye. The mystery is coming together.';
 if(n===3) return s.decisions[2].id==='kind'?'A little kindness makes a big difference. Everyone feels better.':'Together, they solve the problem. Look at those happy faces!';
 return s.decisions[3].id==='remember'?'Maya draws the day in her notebook. A memory to keep.':'The neighborhood celebrates a little everyday adventure!';
}
export function pages(s: Adventure): string[] {
 if(!s.location || s.decisions.length!==4) return [];
 const p=places[s.location], d=s.decisions;
 return [`An Adventure in My Neighborhood\nStarring Maya — and your imagination.`, `Maya stepped outside with her yellow bag and a head full of possibilities. Today, she was going to ${p.name.toLowerCase()}.`, `${s.event} Maya stopped. This ordinary day had just become an adventure.`, `Maya had an idea: “${d[0].text}!” ${d[0].id==='ask'?'A friendly neighbor came over, ready to listen.':'She looked carefully and found the first clue.'}`, `What next? “${d[1].text},” Maya decided. ${d[1].id==='team'?'With a new friend beside her, a plan began to take shape.':'Taking time to notice small things helped her understand what to do.'}`, `“${d[2].text}!” ${s.location==='bakery'?'Soon the little dog was safely back beside the baker.':s.location==='park'?'With help from a grown-up, the kite was safely untangled and back in its owner’s hands.':'The station helper found the suitcase’s owner, who smiled with relief.'} Maya’s choice had made a difference.`, `There was one more thing to do: ${d[3].text.toLowerCase()}. ${d[3].id==='remember'?'Maya filled a page with colors and little details she never wanted to forget.':'Everyone shared a smile. A new friendship was the best part of the day.'}`, `On the way home, Maya thought about ${p.object} and the adventure it had started. Her neighborhood was full of stories — and she couldn’t wait to find the next one.\nThe end… until next time.`];
}
export function restore(value: unknown): Adventure | null { if(!value || typeof value!=='object') return null; const s=value as Adventure; if(s.character!=='Maya'||!s.location||!Object.hasOwn(places,s.location)||!Array.isArray(s.decisions)||s.decisions.length>4||!s.decisions.every(d=>d&&typeof d.id==='string'&&typeof d.text==='string'&&d.text.length<=180))return null; return {...choosePlace(s.location),decisions:s.decisions,outcome:s.decisions.length===4?s.decisions[3].text:''}; }
