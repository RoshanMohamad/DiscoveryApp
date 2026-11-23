import React from 'react';
import { EmptyView } from './EmptyView';

type Props = { message: string; onRetry: () => void };

/** Error state with a Retry button. */
export const ErrorView = ({ message, onRetry }: Props) => (
  <EmptyView
    icon="alert-circle"
    title="Something went wrong"
    message={message}
    actionLabel="Retry"
    onAction={onRetry}
  />
);
