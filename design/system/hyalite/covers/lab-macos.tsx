import type { Markup } from "@design/jsx/jsx-runtime";
import { Cover } from "./cover.tsx";
import { Segmented, SliderRows, Toggles } from "../components/macos.tsx";

export default function CoverLabMacos(): Markup {
  return (
    <Cover tiles={[
      {
        mode: "light",
        width: 440,
        bg: "color",
        children: (
          <div class="flex scale-[1.22] flex-col items-center gap-[26px]">
            <Segmented mode="light" />
            <SliderRows mode="light" />
          </div>
        ),
      },
      {
        mode: "dark",
        width: 440,
        bg: "color",
        children: (
          <div class="flex scale-[1.22] flex-col items-center gap-[26px]">
            <Toggles mode="dark" />
            <SliderRows mode="dark" />
          </div>
        ),
      },
    ]} />
  );
}
