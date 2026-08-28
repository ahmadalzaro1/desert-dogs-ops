/**
 * Verified primary sources for the Problem + Evidence sections.
 *
 * PROVENANCE RULE: every entry here was fetched and confirmed to resolve with
 * real content (HTTP 200 / extracted text) on 2026-08-29. Nothing in this file
 * is paraphrased from memory or inferred. If you add a source, fetch it first
 * and set `verified: true` only after you have actually read it.
 *
 * Factual correction carried from verification: there is NO Jordanian "Animal
 * Welfare Law No. 5 of 2017" — that citation circulates but does not exist. The
 * real instrument is Regulation No. 11 of 2010 (نظام الرفق بالحيوان رقم 11
 * لسنة 2010), implemented by Instructions No. G/18 of 2022. Do not reintroduce
 * the 2017 figure.
 *
 * `supports` states what the source actually establishes — it is the claim the
 * site is allowed to make while citing it, and nothing broader.
 */

export const SOURCES = [
  {
    id: 'change-org-petition',
    url: 'https://www.change.org/p/stop-the-slow-killing-of-street-dogs-in-jordan-s-desert-enclosures',
    title: "Stop the slow killing of street dogs in Jordan's desert enclosures",
    publisher: 'Change.org',
    date: '2026-08-19',
    supports:
      'Documented (video) evidence that Jordanian municipalities confine street dogs in open-desert fenced enclosures with no shade, clean water, food, or veterinary care, and demands humane ABC/TNR instead; 159 verified signatures.',
    kind: 'petition',
    verified: true,
  },
  {
    id: 'athamneh-2025-jaaws',
    url: 'https://doi.org/10.1080/10888705.2025.2500976',
    title: 'Toward Objective Assessment of the Stray Dog Problem in Jordan',
    publisher: 'Journal of Applied Animal Welfare Science (Taylor & Francis)',
    date: '2025-05-06',
    supports:
      'First ongoing survey establishing a baseline and monitoring free-roaming dog populations in Jordan (Vol 29(2), pp 322-334) — the peer-reviewed evidence base for humane management.',
    kind: 'peer-reviewed',
    verified: true,
  },
  {
    id: 'jordan-times-2023',
    url: 'https://jordantimes.com/news/local/low-awareness-lack-legislation-exacerbate-jordans-stray-dog-issue-say-experts',
    title:
      "Low awareness, lack of legislation exacerbate Jordan's stray dog issue, say experts",
    publisher: 'The Jordan Times',
    date: '2023-05-13',
    supports:
      "Experts state that low public awareness and the absence of dedicated animal-welfare legislation worsen Jordan's stray-dog problem, and that humane ABC/TNR is the recommended control method.",
    kind: 'press',
    verified: true,
  },
  {
    id: 'jordan-animal-welfare-regulation-2010',
    url: 'https://leap.unep.org/en/countries/jo/national-legislation/animal-welfare-regulation-no-11-2010',
    title: 'Animal Welfare Regulation No. 11 of 2010',
    publisher: 'UNEP LEAP / FAOLEX (Jordan)',
    date: '2010-04-01',
    supports:
      "Jordan's Animal Welfare Regulation No. 11 of 2010 (نظام الرفق بالحيوان رقم 11 لسنة 2010) commits the Ministry of Agriculture to ensuring animal welfare and preventing cruelty; implemented by Instructions No. G/18 of 2022.",
    kind: 'legislation',
    verified: true,
  },
  {
    id: 'jordan-rabies-jra-2022',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9754930/',
    title:
      'Implementation of one health approach in Jordan: Joint risk assessment of rabies and avian influenza utilizing the tripartite operational tool',
    publisher: 'One Health (Elsevier) / PMC',
    date: '2022',
    supports:
      "Documents that Jordan's Ministry of Agriculture has begun implementing sterilization programs (Animal Birth Control Program) and vaccinating owned dogs for rabies — official Jordanian ABC practice rather than culling.",
    kind: 'peer-reviewed',
    verified: true,
  },
  {
    id: 'woah-rabies',
    url: 'https://www.woah.org/en/disease/rabies/',
    title: 'Rabies — WOAH',
    publisher: 'World Organisation for Animal Health (WOAH)',
    date: null,
    supports:
      'WOAH states dog vaccination is the preferred method to control and eliminate rabies worldwide, and all successful campaigns combine control and vaccination of stray dog populations — supporting CNVR/ABC over culling.',
    kind: 'standard',
    verified: true,
  },
  {
    id: 'morters-2012-rabies-review',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3579231/',
    title:
      'Evidence-based control of canine rabies: a critical review of population density reduction',
    publisher: 'Journal of Animal Ecology (Wiley) / PMC',
    date: '2012-09-24',
    supports:
      "Peer-reviewed review concluding vaccination is the most effective means to control rabies and that culling 'has been shown to be ineffective in controlling rabies in all host species'.",
    kind: 'peer-reviewed',
    verified: true,
  },
  {
    id: 'taylor-2017-dpm',
    url: 'https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2017.00109/full',
    title:
      'The Role of Dog Population Management in Rabies Elimination — A Review of Current Approaches and Future Opportunities',
    publisher: 'Frontiers in Veterinary Science',
    date: '2017-07-09',
    supports:
      'Peer-reviewed review notes mass dog culling is still used as a misguided emergency rabies response, while humane dog population management (sterilization) combined with vaccination is the evidence-based alternative.',
    kind: 'peer-reviewed',
    verified: true,
  },
];

/** Sources cited by the Problem narrative (the situation on the ground). */
export const PROBLEM_SOURCE_IDS = [
  'change-org-petition',
  'athamneh-2025-jaaws',
  'jordan-times-2023',
  'jordan-animal-welfare-regulation-2010',
];

/** Sources backing the ABC/TNR-over-culling policy argument. */
export const POLICY_SOURCE_IDS = [
  'jordan-rabies-jra-2022',
  'woah-rabies',
  'morters-2012-rabies-review',
  'taylor-2017-dpm',
];

export const getSource = (id) => SOURCES.find((s) => s.id === id);

export const getSources = (ids) => ids.map(getSource).filter(Boolean);

export default SOURCES;
