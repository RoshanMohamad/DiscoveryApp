import type Feather from '@react-native-vector-icons/feather';
import type { ComponentProps } from 'react';

/** Any Feather glyph name. Feather is the only icon set the app uses. */
export type IconName = ComponentProps<typeof Feather>['name'];
