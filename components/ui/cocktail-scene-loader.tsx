"use client";

import dynamic from "next/dynamic";
import { Martini } from "@phosphor-icons/react";

const CocktailScene = dynamic(
  () => import("./cocktail-scene").then((m) => m.CocktailScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Martini size={64} weight="thin" className="text-accent/20 animate-pulse" />
      </div>
    ),
  }
);

export function CocktailSceneLoader({ accent }: { accent?: string }) {
  return <CocktailScene accent={accent} />;
}
