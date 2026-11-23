import type { IconName } from '../../shared/components/icons';

/** Label for "no region filter". Also the value stored while nothing is filtered. */
export const ALL_REGIONS = 'All';

const REGION_ICONS: Record<string, IconName> = {
  [ALL_REGIONS]: 'grid',
  Africa: 'sun',
  Americas: 'compass',
  Asia: 'map',
  Europe: 'globe',
  Oceania: 'anchor',
  Antarctic: 'wind',
  Antarctica: 'wind',
};

const FALLBACK_ICON: IconName = 'map-pin';

export const iconForRegion = (region: string): IconName =>
  REGION_ICONS[region] ?? FALLBACK_ICON;
