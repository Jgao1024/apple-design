import type { Markup } from "@design/jsx/jsx-runtime";
import { Cover } from "./cover.tsx";
import { ControlCenterPanel, DockBar, MenuBar } from "../components/macos-more.tsx";

export default function CoverShowcaseMacos(): Markup {
  return (
    <Cover tiles={[
      {
        mode: "light",
        width: 470,
        children: (
          <div class="flex flex-col items-center gap-[20px]">
            <MenuBar mode="light" />
            <DockBar mode="light" />
          </div>
        ),
      },
      {
        mode: "dark",
        width: 470,
        children: (
          <div class="flex flex-col items-center gap-[20px]">
            <ControlCenterPanel mode="dark" />
          </div>
        ),
      },
    ]} />
  );
}
