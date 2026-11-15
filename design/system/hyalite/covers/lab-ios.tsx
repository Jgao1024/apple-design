import type { Markup } from "@design/jsx/jsx-runtime";
import { Cover } from "./cover.tsx";
import { SegmentedControl, Sliders, Switches } from "../components/ios.tsx";

export default function CoverLabIos(): Markup {
  return (
    <Cover tiles={[
      {
        mode: "light",
        width: 470,
        bg: "color",
        children: (
          <div class="flex scale-[1.1] flex-col items-center gap-[26px]">
            <SegmentedControl mode="light" />
            <Switches mode="light" />
            <Sliders mode="light" />
          </div>
        ),
      },
      {
        mode: "dark",
        width: 470,
        bg: "color",
        children: (
          <div class="flex scale-[1.1] flex-col items-center gap-[26px]">
            <SegmentedControl mode="dark" />
            <Switches mode="dark" />
            <Sliders mode="dark" />
          </div>
        ),
      },
    ]} />
  );
}
