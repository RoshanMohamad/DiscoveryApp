import React, { useState } from 'react';
import { CircleButton } from '../../../shared/components/CircleButton';
import type { ShareInput } from '../shareCountry';
import { ShareSheet } from './ShareSheet';

type Props = ShareInput & { tone?: 'overlay' | 'plain' };

/** Share action on the Details screen: opens the in-app share sheet. */
export const ShareButton = ({ tone = 'overlay', ...input }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CircleButton
        icon="share-2"
        label={`Share ${input.name}`}
        tone={tone}
        onPress={() => setOpen(true)}
      />
      <ShareSheet visible={open} onClose={() => setOpen(false)} input={input} />
    </>
  );
};
