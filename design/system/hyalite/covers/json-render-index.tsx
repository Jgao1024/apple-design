import type { Markup } from "@design/jsx/jsx-runtime";
import { Cover, JsonSample } from "./cover.tsx";
import { Alert, TextButton } from "../components/ios.tsx";

export default function CoverJsonRender(): Markup {
  return (
    <Cover tiles={[
      {
        mode: "dark",
        width: 500,
        children: <div class="flex w-full flex-col items-stretch justify-center gap-[14px]"><JsonSample /></div>,
      },
      {
        mode: "light",
        width: 500,
        children: (
          <div class="flex flex-col items-center gap-[18px]">
            <Alert mode="light" />
            <TextButton mode="light" text="继续" width={150} size="large" prominent />
          </div>
        ),
      },
    ]} />
  );
}
