declare module 'react-native-config' {
  export interface NativeConfig {
    REST_COUNTRIES_API_KEY?: string;
    AUTH_BASE_URL?: string;
  }
  export const Config: NativeConfig;
  export default Config;
}
