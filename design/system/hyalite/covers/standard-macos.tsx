import type { Markup } from "@design/jsx/jsx-runtime";
import { Cover } from "./cover.tsx";
import { Buttons, Fields, SliderRows, WindowWithSidebar } from "../components/macos.tsx";
import { MenuPanel } from "../components/macos-more.tsx";

export default function CoverStandardMacos(): Markup {
  return (
    <Cover tiles={[
      {
        mode: "light",
        width: 560,
        children: (
          <div class="flex flex-col items-center gap-[16px]">
            <WindowWithSidebar mode="light" />
            <Fields mode="light" />
            <Buttons mode="light" />
          </div>
        ),
      },
      {
        mode: "dark",
        width: 560,
        children: (
          <div class="flex flex-col items-center gap-[16px]">
            <MenuPanel mode="dark" rows={[{ text: "新建窗口", keys: "⌘N" }, { text: "打开…", keys: "⌘O" }, { text: "共享" }, { text: "关闭", keys: "⌘W" }]} />
            <SliderRows mode="dark" />
          </div>
        ),
      },
    ]} />
  );
}
