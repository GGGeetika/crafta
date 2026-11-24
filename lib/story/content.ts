/**
 * Maya's neighborhood — the story bible.
 *
 * Every line here is written to be read aloud by a grown-up to a child:
 * short sentences, concrete detail, a little humour, no morals.
 * Choices are categories with their own consequences; templates only fill
 * in names and objects, never invent new facts.
 */

export type PlaceId = 'bakery' | 'park' | 'station';
export type ObjectId = 'letter' | 'balloon' | 'scarf' | 'kite' | 'boat' | 'key' | 'suitcase' | 'ticket' | 'hat';
export type SpecialId = 'note' | 'old' | 'curious';
export type TwistId = 'wind' | 'animal' | 'rain';
export type ResponseId = 'run' | 'jump' | 'watch' | 'chase' | 'call' | 'trick' | 'dash' | 'splash' | 'cover';
export type Trait = 'quick' | 'cheerful' | 'clever';
export type FriendId = 'otis' | 'juniper' | 'biscuit';
export type NeedId = 'lost' | 'lonely' | 'searching';
export type PlanId = 'map' | 'ask' | 'follow' | 'play' | 'introduce' | 'share' | 'giveback' | 'guess' | 'party';
export type EndingId = 'picnic' | 'home' | 'tomorrow';

export type Place = {
  id: PlaceId; label: string; to: string; at: string; animal: 'cat' | 'squirrel' | 'pigeon'; animalName: string;
  shelter: string; follow: string; followLabel: string; objects: [ObjectId, ObjectId, ObjectId]; opening: string; seat: string;
};

export const PLACES: Record<PlaceId, Place> = {
  bakery: {
    id: 'bakery', label: 'Little Crumb', to: 'to Little Crumb', at: 'at Little Crumb', animal: 'cat', animalName: 'cat',
    shelter: 'striped awning', follow: 'the smell of warm bread', followLabel: 'Follow the smell of warm bread', objects: ['letter', 'balloon', 'scarf'], seat: 'the bakery bench',
    opening: 'Maya lived on Maple Street, where every morning smelled a little bit like bread. Today she buttoned her yellow coat, swung her satchel over her shoulder, and went straight to Little Crumb, the bakery on the corner.',
  },
  park: {
    id: 'park', label: 'The park', to: 'to the park', at: 'in the park', animal: 'squirrel', animalName: 'squirrel',
    shelter: 'big old tree', follow: 'the ducks along the path', followLabel: 'Follow the ducks along the path', objects: ['kite', 'boat', 'key'], seat: 'the park bench',
    opening: 'Maya lived on Maple Street, just around the corner from the park. Today the air felt like something might happen, so she buttoned her yellow coat and skipped through the green gate to find out what.',
  },
  station: {
    id: 'station', label: 'The station', to: 'to the station', at: 'at the station', animal: 'pigeon', animalName: 'pigeon',
    shelter: 'station roof', follow: 'the sound of the train whistle', followLabel: 'Follow the train whistle', objects: ['suitcase', 'ticket', 'hat'], seat: 'the platform bench',
    opening: 'Maya lived on Maple Street, at the top of the hill where you can hear the trains. Today she buttoned her yellow coat and walked all the way to the station, because something is always happening at the station.',
  },
};

export type Thing = {
  id: ObjectId; name: string; the: string; title: string; found: string; curiousLabel: string; curious: string;
  wind: string; animal: string; share: string; shareLabel: string; flies: boolean;
};

export const THINGS: Record<ObjectId, Thing> = {
  letter: {
    id: 'letter', name: 'letter', the: 'the letter', title: 'Letter', flies: true,
    found: 'Tucked under the bakery door was a letter. It had a red stamp, a red seal, and no name on the front at all.',
    curiousLabel: 'It rustles, as if it wants to talk', curious: 'Every time Maya held it, it rustled, as though it had something important to say.',
    wind: 'and whisked the letter right out of Maya’s hands! Up it went, flapping like a little paper bird.',
    animal: 'snatched the letter in its mouth, and trotted away with its tail held high.',
    share: 'They sat side by side and opened the letter together. Inside was a drawing of Maple Street, with a tiny X marked on it. “Treasure,” whispered Maya.',
    shareLabel: 'Open the letter together',
  },
  balloon: {
    id: 'balloon', name: 'balloon', the: 'the blue balloon', title: 'Balloon', flies: true,
    found: 'Tied to the lamp post outside was a blue balloon, bobbing all by itself, as if it were waiting for someone.',
    curiousLabel: 'It tugs one way, like it knows where to go', curious: 'It kept tugging gently to the right, as if it knew exactly where it wanted to go.',
    wind: 'and pulled the balloon’s string right through Maya’s fingers! Up, up and away it bobbed.',
    animal: 'batted at the dangling string — and off went the balloon, with the cat bounding after it.',
    share: 'They took turns holding the balloon’s string, and it bobbed above them all the way down Maple Street, so everyone could see where they were.',
    shareLabel: 'Take turns with the balloon',
  },
  scarf: {
    id: 'scarf', name: 'scarf', the: 'the striped scarf', title: 'Scarf', flies: true,
    found: 'On the bench sat a long striped scarf, folded very neatly, the way you fold something you mean to come back for.',
    curiousLabel: 'It’s still warm', curious: 'It was still warm, as if someone had only just taken it off.',
    wind: 'and lifted the scarf out of Maya’s arms! It sailed off down the street like a long stripy snake.',
    animal: 'grabbed one end of the scarf and dragged it away down the pavement, very pleased with itself.',
    share: 'The scarf was so long that they could both wear it at once. They walked down Maple Street wrapped up together, like two peas in one stripy pod.',
    shareLabel: 'Wear the scarf together',
  },
  kite: {
    id: 'kite', name: 'kite', the: 'the red kite', title: 'Kite', flies: true,
    found: 'High in the branches of the big old tree, Maya spotted a red kite, caught by its tail. She gave the string a gentle tug, and down it floated into her arms.',
    curiousLabel: 'It tugs, even with no wind', curious: 'Even when there was no wind at all, it gave small, hopeful tugs, as if it were longing to fly.',
    wind: 'and the kite leapt out of Maya’s hands and flew off across the grass, its tail dancing behind it.',
    animal: 'seized the kite’s tail and dashed off across the grass, with the kite bouncing along behind it.',
    share: 'They ran to the top of the hill and let the kite go. It climbed and climbed until it was just a red dot, and they took turns holding the string.',
    shareLabel: 'Fly the kite together',
  },
  boat: {
    id: 'boat', name: 'sailboat', the: 'the little sailboat', title: 'Sailboat', flies: false,
    found: 'On the pond, a little wooden sailboat was turning slow circles, with nobody at all to steer it. Maya fished it out with a stick.',
    curiousLabel: 'It always points the same way', curious: 'Whichever way Maya turned it, the little boat swung round to point the same way, like a compass.',
    wind: 'and blew the little boat out of Maya’s hands and clear across the pond, its sail as round as a full moon.',
    animal: 'hopped onto the little boat and paddled it across the pond, looking extremely proud of itself.',
    share: 'They knelt by the pond and sailed the little boat from one side to the other — Maya pushing, and the breeze doing the rest.',
    shareLabel: 'Sail the boat together',
  },
  key: {
    id: 'key', name: 'key', the: 'the golden key', title: 'Golden Key', flies: false,
    found: 'Under the bench, half hidden in the grass, something glinted. It was a key, old and golden, with a blue ribbon tied through it.',
    curiousLabel: 'It hums, very quietly', curious: 'When Maya held it up to her ear, it hummed — very, very quietly — like a bee asleep.',
    wind: 'and the key’s blue ribbon caught the wind like a sail, and away it skittered across the path.',
    animal: 'snatched up the shiny key, the way squirrels do, and scampered away to hide it.',
    share: 'They tried the key in every lock they could find — the gate, the shed, the little door in the big tree. They never found what it opened, which was the best part.',
    shareLabel: 'Find out what the key opens',
  },
  suitcase: {
    id: 'suitcase', name: 'suitcase', the: 'the striped suitcase', title: 'Suitcase', flies: false,
    found: 'Beside a pillar stood a small striped suitcase, all alone on the platform, with a label that said FRAGILE.',
    curiousLabel: 'Something inside goes tick, tick', curious: 'When Maya put her ear against it, something inside went tick, tick, tick, very politely.',
    wind: 'and set the little suitcase rolling away along the platform on its squeaky wheels!',
    animal: 'landed right on top of the suitcase — and away it rolled along the platform, with the pigeon riding on top like a captain.',
    share: 'They opened the suitcase very carefully. Inside was a wind-up clock, a jar of jam and a pair of striped socks. They agreed it was the most interesting suitcase in the world.',
    shareLabel: 'Peek inside the suitcase',
  },
  ticket: {
    id: 'ticket', name: 'ticket', the: 'the train ticket', title: 'Train Ticket', flies: true,
    found: 'By the ticket window, a train ticket lay face up on the ground, as if it wanted to be found.',
    curiousLabel: 'It’s for a train that leaves very soon', curious: 'It was for a train that left in ten minutes. The ticket seemed to know it, too — it fluttered impatiently.',
    wind: 'and snatched the ticket out of Maya’s fingers! It fluttered away along the platform like a moth.',
    animal: 'pecked up the ticket in its beak and strutted off along the platform as if it had a train to catch.',
    share: 'They sat on the bench and read every word on the ticket, out loud, in their best train-announcer voices. “Maple Street to the Seaside! All aboard!”',
    shareLabel: 'Play trains with the ticket',
  },
  hat: {
    id: 'hat', name: 'hat', the: 'the green hat', title: 'Green Hat', flies: true,
    found: 'On the platform bench sat a green hat with a yellow feather, looking very important and a little bit lost.',
    curiousLabel: 'Its feather twitches at passers-by', curious: 'Its feather twitched whenever someone walked past, as if it were looking for one particular person.',
    wind: 'and whisked the green hat off the bench and away along the platform, rolling on its brim like a wheel!',
    animal: 'perched on the hat, pecked at the feather, and then flapped away with the whole hat dangling below.',
    share: 'They took turns wearing the green hat. It was much too big for both of them, which made it twice as funny.',
    shareLabel: 'Take turns wearing the hat',
  },
};

export const SPECIALS: Record<SpecialId, { label: (t: Thing) => string; line: (t: Thing) => string }> = {
  note: {
    label: () => 'There’s a tiny note tied to it',
    line: (t) => `Tied to ${t.the} was a tiny paper note. In careful, wobbly letters it said: “Please look after me until I get home.”`,
  },
  old: {
    label: () => 'It’s very, very old',
    line: () => 'It looked very old — older than Maya, older than her grown-ups, maybe even older than Maple Street. Someone had mended it once with a careful little patch.',
  },
  curious: {
    label: (t) => t.curiousLabel,
    line: (t) => t.curious,
  },
};

export const TWISTS: Record<TwistId, { label: string; hint: string }> = {
  wind: { label: 'A big gust of wind!', hint: 'Whoosh' },
  animal: { label: 'A cheeky animal!', hint: 'Snatch' },
  rain: { label: 'Rain, all of a sudden!', hint: 'Plip plop' },
};

export const RESPONSES: Record<TwistId, { id: ResponseId; label: string; trait: Trait }[]> = {
  wind: [
    { id: 'run', label: 'Run after it!', trait: 'quick' },
    { id: 'jump', label: 'Jump to catch it!', trait: 'cheerful' },
    { id: 'watch', label: 'Watch where it lands', trait: 'clever' },
  ],
  animal: [
    { id: 'chase', label: 'Chase it!', trait: 'quick' },
    { id: 'call', label: 'Shout “Come back!”', trait: 'cheerful' },
    { id: 'trick', label: 'Offer it a crumb', trait: 'clever' },
  ],
  rain: [
    { id: 'dash', label: 'Dash for cover!', trait: 'quick' },
    { id: 'splash', label: 'Splash in the puddles', trait: 'cheerful' },
    { id: 'cover', label: 'Make a roof with her satchel', trait: 'clever' },
  ],
};

export type Friend = { id: FriendId; name: string; he: string; him: string; his: string; label: string; intro: string; isDog: boolean };
export const FRIENDS: Record<FriendId, Friend> = {
  otis: { id: 'otis', name: 'Otis', he: 'he', him: 'him', his: 'his', isDog: false, label: 'Grandpa Otis',
    intro: 'It was an old gentleman with a flat cap, round glasses and a moustache like a small white cloud. “Good morning,” he said, with a little bow. “My name is Otis.”' },
  juniper: { id: 'juniper', name: 'Juniper', he: 'she', him: 'her', his: 'her', isDog: false, label: 'Juniper',
    intro: 'It was a girl about Maya’s age, in a red coat with wooden toggles and freckles all over her nose. “Hi,” she said. “I’m Juniper.”' },
  biscuit: { id: 'biscuit', name: 'Biscuit', he: 'he', him: 'him', his: 'his', isDog: true, label: 'Biscuit the dog',
    intro: 'It was a small scruffy dog with one floppy ear and one ear that stood straight up, like a question. The tag on his collar said BISCUIT.' },
};

export const NEEDS: Record<NeedId, { label: (f: Friend, t: Thing) => string }> = {
  lost: { label: (f) => (f.isDog ? 'He’s lost and can’t find home' : `${f.he === 'she' ? 'She’s' : 'He’s'} lost and can’t find home`) },
  lonely: { label: (f) => (f.isDog ? 'He has nobody to play with' : f.id === 'otis' ? 'He’s lonely since his friends moved away' : 'She’s new here and knows nobody') },
  searching: { label: (f, t) => `${t.the[0].toUpperCase() + t.the.slice(1)} is ${f.his}!` },
};

export const PLANS: Record<NeedId, PlanId[]> = {
  lost: ['map', 'ask', 'follow'],
  lonely: ['play', 'introduce', 'share'],
  searching: ['giveback', 'guess', 'party'],
};

export const ENDINGS: Record<EndingId, { label: string }> = {
  picnic: { label: 'Share a treat from Little Crumb' },
  home: { label: 'Walk home as the lamps come on' },
  tomorrow: { label: 'Promise to meet again tomorrow' },
};
