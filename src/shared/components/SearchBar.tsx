import React, { useMemo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useTheme, type Theme } from '../../theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    field: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: theme.minTouchSize,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      backgroundColor: theme.colors.glass,
      paddingHorizontal: theme.spacing.md,
    },
    icon: { marginRight: theme.spacing.sm },
    input: {
      flex: 1,
      minHeight: theme.minTouchSize,
      color: theme.colors.text,
      ...theme.typography.body,
    },
    clear: {
      minWidth: theme.minTouchSize,
      minHeight: theme.minTouchSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -theme.spacing.md,
    },
  });

/** Search input with a leading magnifier and a clear button. */
export const SearchBar = ({ value, onChangeText, placeholder }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.field}>
      <Feather
        name="search"
        size={theme.iconSize.md}
        color={theme.colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChangeText('')}
          style={styles.clear}
        >
          <Feather
            name="x"
            size={theme.iconSize.md}
            color={theme.colors.textMuted}
          />
        </Pressable>
      ) : null}
    </View>
  );
};
