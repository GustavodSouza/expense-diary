declare module 'v-money' {
  import { PluginObject } from 'vue';

  interface VMoneyOptions {
    decimal?: string;
    thousands?: string;
    prefix?: string;
    suffix?: string;
    precision?: number;
  }

  export function install(Vue: any, options?: VMoneyOptions): void;

  const vMoney: {
    install: typeof install;
  };

  export default vMoney;
}
