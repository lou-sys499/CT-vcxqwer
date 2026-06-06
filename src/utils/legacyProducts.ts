export interface LegacyMapping {
  legacyId: string;
  legacyNames: string[];
  officialId: string;
  officialName: string;
}

export const LEGACY_PRODUCTS_MAPPING: LegacyMapping[] = [
  {
    legacyId: 'dewalt-cordless-nailer',
    legacyNames: ['dewalt cordless nailer', 'dewalt nailer', 'cordless nailer', '18ga brad nailer kit', 'dcn210e1'],
    officialId: 'bJC3LXXaI6nnVx1LPDZQ',
    officialName: '20V MAX* XR Cordless 18Ga Brad Nailer Kit(DCN210E1)'
  },
  {
    legacyId: 'dewalt-circular-saw',
    legacyNames: ['dewalt 7 1/4 circular saw', 'dewalt circular saw', 'circular saw', 'circular saw kit'],
    officialId: 'DkEyWlilG9aPHXpLPpnB',
    officialName: '20V MAX* XR Cordless 7-1/4 In. Circular Saw Kit'
  },
  {
    legacyId: 'cordless-rivet-nut-tool',
    legacyNames: ['cordless rivet nut tool', 'rivet nut tool', 'rivet nut gun', 'rivet nut gun with 1/4", 5/16", 3/8" head', 'rivet nut tool-30-r1'],
    officialId: 'IMe77QhP3Fp46n47EX22',
    officialName: 'Rivet Nut Tool-30-R1'
  },
  {
    legacyId: 'cordless-nail-drill',
    legacyNames: ['cordless nail drill', 'nail drill', 'nail file', '18v one+ hp compact brushless 1/2" drill/driver kit', 'ryobi psbdd01k'],
    officialId: 'hVZ0Rdg3yCTMk638A7XE',
    officialName: '18V ONE+ HP COMPACT BRUSHLESS 1/2" DRILL/DRIVER KIT (RYOBI PSBDD01K)'
  },
  {
    legacyId: 'smoture-cordless-vacuum',
    legacyNames: ['smoture cordless vacuum cleaner', 'smoture vacuum', 'smoture cordless vacuum', 'vc70 cordless vacuum cleaner', 'vac01', 'vac02', 'vac03'],
    officialId: 'Gfq4mE7ycIlFcIBLAwJ9', // VC70 Cordless Vacuum Cleaner
    officialName: 'VC70 Cordless Vacuum Cleaner'
  },
  {
    legacyId: 'vaclife-cordless-vacuum',
    legacyNames: ['vaclife cordless vacuum cleaner', 'vaclife vacuum', 'vaclife cordless vacuum', 'us726', 'vl189', 'h-111'],
    officialId: 'WXVUNB4VdAHjPTHJKBVF', // US726 Cordless Handheld Vacuum
    officialName: 'US726 Cordless Handheld Vacuum'
  },
  {
    legacyId: 'inteture-cordless-vacuum',
    legacyNames: ['inteture cordless vacuum cleaner', 'inteture vacuum', 'inteture cordless vacuum', 'jr400', 'bp10', 'bp20', 'bp30', 'bp40', 'bp50'],
    officialId: 'UhD1sUQ6K7rFWMvCyBqe', // Cordless Vacuum JR400
    officialName: 'Cordless Vacuum JR400'
  },
  {
    legacyId: 'dolphin-pool-cleaner',
    legacyNames: ['dolphin pool cleaner cordless', 'dolphin liberty', 'dolphin cordless vacuum', 'dolphin pool cleaner', 'liberty 200', 'liberty 300', 'liberty 400', 'liberty 600', 'eon 100', 'eon 120d'],
    officialId: 'H8nxPWb4gFbyc3vCmt0M', // Dolphin LIBERTY 200
    officialName: 'Dolphin LIBERTY 200'
  }
];

/**
 * Searches the mapping registry to check if a search term
 * or ID corresponds to a legacy product name, returning the official ID.
 */
export function getOfficialRedirectId(idOrSlug: string): string | null {
  const normalized = idOrSlug.toLowerCase().trim();
  const match = LEGACY_PRODUCTS_MAPPING.find(m => 
    m.legacyId.toLowerCase() === normalized || 
    m.officialId.toLowerCase() === normalized
  );
  return match ? match.officialId : null;
}
