export type TechniquePreparation =
  | "shake"
  | "stir"
  | "build"
  | "muddle"
  | "blend"
  | "autre";

export const TECHNIQUES: { value: TechniquePreparation; label: string }[] = [
  { value: "shake", label: "Shaké" },
  { value: "stir", label: "Mélangé (stir)" },
  { value: "build", label: "Construit (build)" },
  { value: "muddle", label: "Pilé (muddle)" },
  { value: "blend", label: "Blendé" },
  { value: "autre", label: "Autre" },
];

export const CATEGORIES_ALCOOL = [
  "Gin",
  "Rhum",
  "Whisky",
  "Vodka",
  "Tequila",
  "Cognac/Brandy",
  "Liqueur",
  "Vin/Champagne",
  "Sans alcool",
] as const;

export type IngredientLigne = {
  ingredient_nom: string;
  quantite: string;
  unite: string;
};
