import type { Markup } from "@design/jsx/jsx-runtime";
import { Cover } from "./cover.tsx";
import { Buttons, TabBar, Toolbar } from "../components/ios.tsx";
import { Menu, Segmented, WindowWithSidebar } from "../components/macos.tsx";

export default function CoverStandardBoth(): Markup {
  return (
    <Cover tiles={[
      {
        mode: "light",
        width: 470,
        children: (
          <div class="flex flex-col items-center gap-[18px]">
            <Toolbar mode="light" />
            <TabBar mode="light" />
            <Buttons mode="light" />
          </div>
        ),
      },
      {
        mode: "dark",
        width: 560,
        children: (
          <div class="flex flex-col items-center gap-[16px]">
            <WindowWithSidebar mode="dark" />
            <div class="flex items-center gap-[14px]">
              <Segmented mode="dark" />
              <Menu mode="dark" />
            </div>
          </div>
        ),
      },
    ]} />
  );
}
