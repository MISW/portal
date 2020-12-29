declare module "tailwindcss/resolveConfig" {
  export type Colors = { [key: string]: string | Colors };
  export interface Config {
    theme: {
      colors: Colors;
    };
  }
  function resolveConfig(): Config;
  export default resolveConfig;
}
