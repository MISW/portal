declare module "*.svg" {
  import { ComponentType, SVGProps } from "react";
  declare const Svg: ComponentType<SVGProps<SVGSVGElement>>;
  export default Svg;
}
