export interface LumaFact {
  type: 'BRAIN FACTS' | 'STRANGE BUT TRUE' | 'QUICK FACT' | 'YOUR BRAIN NOTE' | 'LUMA FACTS' | 'DID YOU KNOW?' | 'FYI';
  title: string;
  body: string;
}

export const lumaFacts: LumaFact[] = [
  {
    type: 'BRAIN FACTS',
    title: 'Dopamine isn\'t simply a "pleasure chemical."',
    body: 'It plays roles in motivation, learning, reward and movement.',
  },
  {
    type: 'STRANGE BUT TRUE',
    title: 'Your brain can become accustomed to frequent novelty.',
    body: 'That can be one reason slower activities sometimes feel unusually boring after lots of rapid-fire content.',
  },
  {
    type: 'QUICK FACT',
    title: 'Your attention can be interrupted even when you don\'t respond to a notification.',
    body: 'The possibility of checking it can itself become distracting.',
  },
  {
    type: 'YOUR BRAIN NOTE',
    title: 'Not every quiet moment needs to be filled.',
    body: 'Sometimes your mind benefits from having nothing new to process.',
  },
  {
    type: 'LUMA FACTS',
    title: 'Your first few hours don\'t have to be your most stimulating hours.',
    body: 'Try protecting them for meaningful work.',
  },
  {
    type: 'DID YOU KNOW?',
    title: 'You don\'t have to respond to every notification immediately.',
    body: 'Most things can wait until you\'ve finished what matters.',
  },
  {
    type: 'FYI',
    title: 'A short walk without your phone can be a real break.',
    body: 'Not another opportunity to consume content.',
  },
  {
    type: 'BRAIN FACTS',
    title: 'Attention is a limited resource at any given moment.',
    body: 'Not because it gets "used up," but because the brain can only fully focus on a few things at once.',
  },
  {
    type: 'DID YOU KNOW?',
    title: 'Constant novelty can make ordinary activities feel less immediately interesting.',
    body: 'Studying, reading, walking, sitting quietly — you don\'t have to immediately fix that feeling.',
  },
  {
    type: 'YOUR BRAIN NOTE',
    title: 'If you don\'t like how your mind feels lately, look at your inputs.',
    body: 'What have you been watching? Reading? Thinking about all day?',
  },
  {
    type: 'LUMA FACTS',
    title: 'Entertainment isn\'t bad. Timing and intention matter.',
    body: 'Do the difficult thing before the rewarding thing.',
  },
  {
    type: 'QUICK FACT',
    title: 'Your mind learns from repeated patterns.',
    body: 'What you repeatedly watch, read and listen to can influence what you notice, prefer and expect.',
  },
];

export function factOfDay(): LumaFact {
  const day = Math.floor(Date.now() / 86400000);
  return lumaFacts[day % lumaFacts.length];
}
