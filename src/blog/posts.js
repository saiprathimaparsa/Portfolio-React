// Blog posts for "Learning in Public" — newest first.
// One new post a day: to add tomorrow's, copy the entry below, give it a
// unique slug, pick an icon ('speaker' | 'code' | 'eye' | 'sparkles' | 'bulb')
// and a gradient, and write the body as a couple of short paragraphs.

export const posts = [
  {
    slug: 'getting-things-done-with-a-personal-agent',
    title: 'Getting things done with a personal agent',
    category: 'Personal Agents',
    date: '2026-10-28',
    dateLabel: 'Wednesday, October 28, 2026',
    excerpt:
      "A small everyday experiment: letting an agent keep an eye on the kids' routine and announce what matters on our home speakers.",
    icon: 'speaker',
    gradient: 'from-indigo-500 to-purple-600',
    body: [
      {
        type: 'paragraph',
        text: "I've been trying out a personal agent for everyday things lately — not for work, just for the small stuff at home that usually lives in my head or in my inbox. Today I gave it one job: the kids' routine.",
      },
      {
        type: 'paragraph',
        text: "It pulled together the bits that matter from a few websites I already use, and with a couple of routines the home speakers — an Echo Dot in one room, a Google Nest in another — now announce the important updates out loud. Homework that's due, what's on tomorrow, the little things that are easy to miss. The whole house hears it, not just me.",
      },
      {
        type: 'paragraph',
        text: "It took some fiddling, and not everything worked the first try. But it works now, and I'm learning how much I can hand over, one small thing at a time. The plan is to keep it that way — one small thing a day.",
      },
    ],
  },
];

export const getPostBySlug = (slug) => posts.find((post) => post.slug === slug);
