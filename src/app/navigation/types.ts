import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from './routes';

export type AuthStackParamList = {
  [ROUTES.Onboarding]: undefined;
  /** `registered` shows the "account created" message after sign-up. */
  [ROUTES.Login]: { registered?: boolean } | undefined;
  [ROUTES.Register]: undefined;
};

/** Details receives ONLY the ISO alpha-3 code and fetches its own data. */
export type HomeStackParamList = {
  [ROUTES.Home]: undefined;
  [ROUTES.CountryDetails]: { code: string };
};

export type AppTabParamList = {
  [ROUTES.HomeTab]: undefined;
  [ROUTES.FavouritesTab]: undefined;
  [ROUTES.ProfileTab]: undefined;
};

export type AppStackParamList = {
  [ROUTES.Tabs]: NavigatorScreenParams<AppTabParamList>;
  [ROUTES.CountryDetails]: { code: string };
};

export type RootStackParamList = {
  [ROUTES.Auth]: NavigatorScreenParams<AuthStackParamList>;
  [ROUTES.App]: NavigatorScreenParams<AppStackParamList>;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    BottomTabScreenProps<AppTabParamList>
  >;

export type AppTabScreenProps<T extends keyof AppTabParamList> =
  BottomTabScreenProps<AppTabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
