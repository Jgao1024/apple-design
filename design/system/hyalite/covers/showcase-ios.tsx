import type { Markup } from "@design/jsx/jsx-runtime";
import { Cover } from "./cover.tsx";
import { ActionSheet, EditMenu, PageIndicator } from "../components/ios-more.tsx";

export default function CoverShowcaseIos(): Markup {
  return (
    <Cover tiles={[
      {
        mode: "light",
        width: 470,
        children: (
          <div class="flex flex-col items-center gap-[24px]">
            <EditMenu mode="light" />
            <PageIndicator mode="light" />
          </div>
        ),
      },
      {
        mode: "dark",
        width: 470,
        children: <ActionSheet mode="dark" />,
      },
    ]} />
  );
}
