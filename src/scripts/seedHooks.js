/**
 * Seed script: populates HookTemplate table with 40 hook templates.
 * Run: node src/scripts/seedHooks.js
 */

require('dotenv').config();
const prisma = require('../config/prisma');

const hooks = [
  // ─── FITNESS (7) ─────────────────────────────────────────────────
  {
    category: 'Fitness',
    type    : 'Question',
    template: 'What if you could lose [X] kg without giving up [your favourite food]?',
    example : 'What if you could lose 5 kg without giving up rice and roti?',
    tags    : 'fitness,weightloss,diet,health,transformation',
  },
  {
    category: 'Fitness',
    type    : 'Bold Claim',
    template: 'I went from [starting point] to [result] in [timeframe] — and I never went to the gym.',
    example : 'I went from 90 kg to 72 kg in 4 months — and I never went to the gym.',
    tags    : 'fitness,transformation,weightloss,homeworkout,nogymnofear',
  },
  {
    category: 'Fitness',
    type    : 'Story',
    template: 'Last [timeframe], I could not even [basic physical activity]. Here is what changed.',
    example : 'Last year, I could not even climb one flight of stairs. Here is what changed.',
    tags    : 'fitness,journey,motivation,health,transformation',
  },
  {
    category: 'Fitness',
    type    : 'Statistic',
    template: '[X]% of people who start a fitness journey quit within [timeframe]. Here is the one reason why — and how to beat it.',
    example : '80% of people who start a fitness journey quit within 3 weeks. Here is the one reason why — and how to beat it.',
    tags    : 'fitness,consistency,habit,workout,discipline',
  },
  {
    category: 'Fitness',
    type    : 'Controversy',
    template: 'Stop doing [popular exercise]. It is ruining your [body part].',
    example : 'Stop doing crunches. They are ruining your lower back.',
    tags    : 'fitness,workout,tips,myth,bodybuilding',
  },
  {
    category: 'Fitness',
    type    : 'How-To',
    template: 'How to lose [amount] in [timeframe] without a single diet plan or gym membership.',
    example : 'How to lose 8 kg in 60 days without a single diet plan or gym membership.',
    tags    : 'fitness,weightloss,tips,guide,health',
  },
  {
    category: 'Fitness',
    type    : 'Question',
    template: 'Are you making [this mistake] every time you work out?',
    example : 'Are you making this breathing mistake every time you work out?',
    tags    : 'fitness,workout,tips,mistake,exercise',
  },

  // ─── FINANCE (7) ─────────────────────────────────────────────────
  {
    category: 'Finance',
    type    : 'Bold Claim',
    template: 'I saved ₹[amount] in [timeframe] on a ₹[salary] salary. Here is exactly how.',
    example : 'I saved ₹1 lakh in 6 months on a ₹30,000 salary. Here is exactly how.',
    tags    : 'finance,savings,money,personalfinance,india',
  },
  {
    category: 'Finance',
    type    : 'Question',
    template: 'What would you do if your salary doubled tomorrow — and why that question reveals your biggest money mistake?',
    example : 'What would you do if your salary doubled tomorrow — and why that question reveals your biggest money mistake?',
    tags    : 'finance,money,mindset,wealth,personalfinance',
  },
  {
    category: 'Finance',
    type    : 'Statistic',
    template: '[X]% of Indians have less than ₹[amount] in emergency savings. Are you one of them?',
    example : '72% of Indians have less than ₹10,000 in emergency savings. Are you one of them?',
    tags    : 'finance,india,savings,emergency,money',
  },
  {
    category: 'Finance',
    type    : 'Story',
    template: 'I lost ₹[amount] in [investment/scheme]. Here is everything I learned so you do not have to.',
    example : 'I lost ₹50,000 in a random mutual fund. Here is everything I learned so you do not have to.',
    tags    : 'finance,investing,mistake,lesson,money',
  },
  {
    category: 'Finance',
    type    : 'Controversy',
    template: 'Your parents\' advice about money is making you poor. Here is why.',
    example : 'Your parents\' advice about money is making you poor. Here is why.',
    tags    : 'finance,money,myth,advice,wealth',
  },
  {
    category: 'Finance',
    type    : 'How-To',
    template: 'How to build an emergency fund of ₹[amount] in [timeframe] even if you live paycheck to paycheck.',
    example : 'How to build an emergency fund of ₹50,000 in 90 days even if you live paycheck to paycheck.',
    tags    : 'finance,savings,emergencyfund,money,tips',
  },
  {
    category: 'Finance',
    type    : 'Bold Claim',
    template: 'The [X]-minute habit that turned my finances around completely.',
    example : 'The 10-minute Sunday habit that turned my finances around completely.',
    tags    : 'finance,habit,money,savings,personalfinance',
  },

  // ─── FOOD (5) ────────────────────────────────────────────────────
  {
    category: 'Food',
    type    : 'How-To',
    template: 'How to make restaurant-style [dish] at home in under [X] minutes.',
    example : 'How to make restaurant-style butter chicken at home in under 20 minutes.',
    tags    : 'food,recipe,cooking,homemade,indianfood',
  },
  {
    category: 'Food',
    type    : 'Question',
    template: 'What if I told you that the [popular food item] you have been making wrong your entire life?',
    example : 'What if I told you that the dal tadka you have been making wrong your entire life?',
    tags    : 'food,cooking,tips,recipe,indianfood',
  },
  {
    category: 'Food',
    type    : 'Bold Claim',
    template: 'This one [ingredient] makes every Indian dish taste 10x better — and nobody talks about it.',
    example : 'This one ingredient makes every Indian dish taste 10x better — and nobody talks about it.',
    tags    : 'food,cooking,hack,tips,indianfood',
  },
  {
    category: 'Food',
    type    : 'Story',
    template: 'I tried making [dish] every day for [X] days. Here is what I discovered.',
    example : 'I tried making biryani every day for 30 days. Here is what I discovered.',
    tags    : 'food,challenge,recipe,cooking,biryani',
  },
  {
    category: 'Food',
    type    : 'Controversy',
    template: 'The [popular dish] you order from Zomato is nothing like the real version. Here is the authentic recipe.',
    example : 'The butter chicken you order from Zomato is nothing like the real version. Here is the authentic recipe.',
    tags    : 'food,authentic,recipe,swiggy,zomato',
  },

  // ─── TECH (5) ────────────────────────────────────────────────────
  {
    category: 'Tech',
    type    : 'How-To',
    template: 'How to use [AI tool / app] to do [task] in [X] seconds — most people do not know this.',
    example : 'How to use ChatGPT to write your entire weekly content plan in 30 seconds — most people do not know this.',
    tags    : 'tech,ai,productivity,tools,hack',
  },
  {
    category: 'Tech',
    type    : 'Bold Claim',
    template: 'This free [tool/app] does what [expensive software] does — and it is completely free.',
    example : 'This free app does what Adobe Premiere does — and it is completely free.',
    tags    : 'tech,tools,free,productivity,app',
  },
  {
    category: 'Tech',
    type    : 'Question',
    template: 'Are you still doing [manual task] manually? This [tool] does it in [timeframe].',
    example : 'Are you still editing videos manually? This AI tool does it in 2 minutes.',
    tags    : 'tech,automation,tools,productivity,ai',
  },
  {
    category: 'Tech',
    type    : 'Controversy',
    template: '[Popular tech product] is overrated. Here is what you should actually buy instead.',
    example : 'The latest iPhone is overrated. Here is what you should actually buy instead.',
    tags    : 'tech,gadgets,review,honest,opinion',
  },
  {
    category: 'Tech',
    type    : 'Statistic',
    template: 'People who use [tool/method] are [X]x more productive than those who do not. Here is how to start.',
    example : 'People who use keyboard shortcuts are 3x more productive than those who do not. Here is how to start.',
    tags    : 'tech,productivity,tips,efficiency,shortcuts',
  },

  // ─── MOTIVATION (4) ──────────────────────────────────────────────
  {
    category: 'Motivation',
    type    : 'Story',
    template: 'I failed [X] times before I finally figured out [the thing]. Here is the story.',
    example : 'I failed 17 times before I finally figured out how to be consistent. Here is the story.',
    tags    : 'motivation,mindset,growth,failure,success',
  },
  {
    category: 'Motivation',
    type    : 'Bold Claim',
    template: 'The one mindset shift that changed everything for me — and it took only [X] seconds to understand.',
    example : 'The one mindset shift that changed everything for me — and it took only 10 seconds to understand.',
    tags    : 'motivation,mindset,growth,success,life',
  },
  {
    category: 'Motivation',
    type    : 'Controversy',
    template: '"Work hard and you will succeed" is a lie. Here is what actually works.',
    example : '"Work hard and you will succeed" is a lie. Here is what actually works.',
    tags    : 'motivation,success,truth,mindset,hustle',
  },
  {
    category: 'Motivation',
    type    : 'Question',
    template: 'What would your life look like in [X] years if you started [habit/action] today?',
    example : 'What would your life look like in 5 years if you started reading 10 pages a day today?',
    tags    : 'motivation,habit,growth,life,future',
  },

  // ─── RELATIONSHIPS (3) ───────────────────────────────────────────
  {
    category: 'Relationships',
    type    : 'Controversy',
    template: 'Nobody talks about [uncomfortable relationship truth]. Here is what you need to know.',
    example : 'Nobody talks about how most friendships are transactional. Here is what you need to know.',
    tags    : 'relationships,truth,life,friendship,social',
  },
  {
    category: 'Relationships',
    type    : 'Story',
    template: 'I spent [timeframe] studying [relationship type] and here is the pattern I noticed.',
    example : 'I spent 2 years studying toxic relationships and here is the pattern I noticed.',
    tags    : 'relationships,psychology,patterns,self-awareness,life',
  },
  {
    category: 'Relationships',
    type    : 'How-To',
    template: 'How to spot a [relationship red flag] in the first [X] minutes of meeting someone.',
    example : 'How to spot a toxic person in the first 5 minutes of meeting someone.',
    tags    : 'relationships,redflag,tips,psychology,dating',
  },

  // ─── BUSINESS (4) ────────────────────────────────────────────────
  {
    category: 'Business',
    type    : 'Bold Claim',
    template: 'I built a ₹[amount]/month business with ₹[investment] and zero experience. Here is the full breakdown.',
    example : 'I built a ₹1 lakh/month business with ₹5,000 and zero experience. Here is the full breakdown.',
    tags    : 'business,startup,entrepreneur,india,money',
  },
  {
    category: 'Business',
    type    : 'How-To',
    template: 'How to start a [type of business] in India with less than ₹[amount] — step by step.',
    example : 'How to start a dropshipping business in India with less than ₹10,000 — step by step.',
    tags    : 'business,startup,india,entrepreneur,guide',
  },
  {
    category: 'Business',
    type    : 'Question',
    template: 'What business can you start this weekend with [X] hours and ₹[amount]?',
    example : 'What business can you start this weekend with 4 hours and ₹500?',
    tags    : 'business,sidehustle,entrepreneur,india,startup',
  },
  {
    category: 'Business',
    type    : 'Statistic',
    template: '[X]% of Indian startups fail in [timeframe]. These [number] mistakes are why.',
    example : '90% of Indian startups fail in 2 years. These 3 mistakes are why.',
    tags    : 'business,startup,india,failure,lesson',
  },

  // ─── HEALTH (3) ──────────────────────────────────────────────────
  {
    category: 'Health',
    type    : 'Controversy',
    template: 'The [popular health habit] you do every day is actually harming your [body system].',
    example : 'The morning juice you drink every day is actually harming your gut.',
    tags    : 'health,wellness,myth,habit,nutrition',
  },
  {
    category: 'Health',
    type    : 'Statistic',
    template: 'Doctors say [X]% of [health issue] cases are preventable with one simple change. Here is what it is.',
    example : 'Doctors say 60% of back pain cases are preventable with one simple change. Here is what it is.',
    tags    : 'health,wellness,prevention,tips,doctor',
  },
  {
    category: 'Health',
    type    : 'How-To',
    template: 'How to fix [health issue] in [timeframe] — without medication or expensive treatments.',
    example : 'How to fix poor sleep in 7 days — without medication or expensive treatments.',
    tags    : 'health,sleep,wellness,natural,tips',
  },

  // ─── EXTRA MOTIVATION + GENERAL (2) to reach 40 ──────────────────
  {
    category: 'Motivation',
    type    : 'Statistic',
    template: 'Only [X]% of people will [achieve goal]. Here is what separates them from the rest.',
    example : 'Only 8% of people will actually stick to their goals this year. Here is what separates them from the rest.',
    tags    : 'motivation,goals,discipline,success,mindset',
  },
  {
    category: 'Business',
    type    : 'Story',
    template: 'I quit my [salary] job to start [business/venture]. Here is what nobody tells you about that decision.',
    example : 'I quit my ₹60,000/month job to start a YouTube channel. Here is what nobody tells you about that decision.',
    tags    : 'business,career,courage,entrepreneur,story',
  },
];

async function main() {
  console.log('Seeding hook templates...');

  // Clear existing records first to avoid duplicates on re-run
  await prisma.hookTemplate.deleteMany({});
  console.log('Cleared existing hook templates.');

  const created = await prisma.hookTemplate.createMany({ data: hooks });
  console.log(`Seeded ${created.count} hook templates successfully!`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
