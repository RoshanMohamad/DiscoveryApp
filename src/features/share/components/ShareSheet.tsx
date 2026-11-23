import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Modal, Pressable, StyleSheet, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Feather from '@react-native-vector-icons/feather';
import { AppText } from '../../../shared/components/AppText';
import { CircleButton } from '../../../shared/components/CircleButton';
import type { IconName } from '../../../shared/components/icons';
import { useTheme, type Theme } from '../../../theme';
import { withAlpha } from '../../../theme/colors';
import { buildCountryLink } from '../deepLink';
import {
  buildShareMessage,
  shareCountry,
  type ShareInput,
} from '../shareCountry';

type Props = { visible: boolean; onClose: () => void; input: ShareInput };

type Target = {
  label: string;
  icon: IconName;
  /** Brand colour of the target app. Fixed on purpose: it identifies that app. */
  color: string;
  /** Deep link into that app; `null` = use the system share sheet. */
  url: ((message: string) => string) | null;
};

const TARGETS: readonly Target[] = [
  {
    label: 'WhatsApp',
    icon: 'message-circle',
    color: '#25D366',
    url: m => `whatsapp://send?text=${encodeURIComponent(m)}`,
  },
  {
    label: 'Messages',
    icon: 'message-square',
    color: '#34C759',
    url: m => `sms:?body=${encodeURIComponent(m)}`,
  },
  {
    label: 'Telegram',
    icon: 'send',
    color: '#229ED9',
    url: m => `tg://msg?text=${encodeURIComponent(m)}`,
  },
  { label: 'More', icon: 'more-horizontal', color: '#A8A6D6', url: null },
];

const COPIED_MS = 1500;
const TARGET_SIZE = 56;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: theme.colors.overlay,
    },
    sheet: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      backgroundColor: theme.colors.sheet,
      borderTopWidth: 1,
      borderColor: theme.colors.glassBorder,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    subtitle: { marginBottom: theme.spacing.lg },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: theme.minTouchSize,
      paddingLeft: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      backgroundColor: theme.colors.glass,
      gap: theme.spacing.sm,
    },
    link: { flex: 1 },
    copy: {
      width: theme.minTouchSize,
      height: theme.minTouchSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    targets: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: theme.spacing.xl,
    },
    target: {
      alignItems: 'center',
      minWidth: theme.minTouchSize,
      gap: theme.spacing.xs,
    },
    disc: {
      width: TARGET_SIZE,
      height: TARGET_SIZE,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

/** Bottom sheet: the country's deep link with Copy, and one-tap share targets. */
export const ShareSheet = ({ visible, onClose, input }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [copied, setCopied] = useState(false);
  const link = buildCountryLink(input.code);
  const message = buildShareMessage(input);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyLink = () => {
    Clipboard.setString(link);
    setCopied(true);
  };

  const openTarget = async (target: Target) => {
    onClose();
    if (target.url) {
      try {
        await Linking.openURL(target.url(message));
        return;
      } catch {
        // The app is not installed: fall back to the system share sheet.
      }
    }
    await shareCountry(input);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close share sheet"
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <AppText variant="heading">Share Country</AppText>
            <CircleButton
              icon="x"
              label="Close"
              tone="plain"
              onPress={onClose}
            />
          </View>
          <AppText muted style={styles.subtitle}>
            Share a link to this country with your friends.
          </AppText>
          <View style={styles.linkRow}>
            <Feather
              name="link"
              size={theme.iconSize.md}
              color={theme.colors.textMuted}
            />
            <AppText variant="label" style={styles.link} numberOfLines={1}>
              {link}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={copied ? 'Link copied' : 'Copy link'}
              onPress={copyLink}
              style={styles.copy}
            >
              <Feather
                name={copied ? 'check' : 'copy'}
                size={theme.iconSize.md}
                color={copied ? theme.colors.success : theme.colors.primary}
              />
            </Pressable>
          </View>
          <View style={styles.targets}>
            {TARGETS.map(target => (
              <Pressable
                key={target.label}
                accessibilityRole="button"
                accessibilityLabel={`Share via ${target.label}`}
                onPress={() => openTarget(target)}
                style={styles.target}
              >
                <View
                  style={[
                    styles.disc,
                    {
                      backgroundColor: withAlpha(target.color, 0.18),
                      borderColor: withAlpha(target.color, 0.5),
                    },
                  ]}
                >
                  <Feather
                    name={target.icon}
                    size={theme.iconSize.lg}
                    color={target.color}
                  />
                </View>
                <AppText variant="caption" muted>
                  {target.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};
