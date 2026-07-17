-- 0020 : recettes classiques (livre de référence)
-- Insère les cocktails classiques rattachés au profil admin (is_admin = true)
do $$
declare
  v_admin_id uuid;
  v_id uuid;
begin
  select id into v_admin_id from public.profiles where is_admin = true limit 1;
  if v_admin_id is null then
    raise exception 'Aucun profil admin trouve (is_admin = true). Creez-en un avant de lancer ce script.';
  end if;

  -- Tequila Sunrise
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Tequila Sunrise', 'Tequila', 'build', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Tequila', 40, 'ml', 1),
    (v_id, 'Jus d''orange', null, 'compléter', 2),
    (v_id, 'Grenadine', 10, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Tequila (40 ml).', 2),
    (v_id, 'Compléter avec Jus d''orange.', 3),
    (v_id, 'Verser délicatement Grenadine (10 ml) en flotte sur le dessus.', 4);

  -- Rusty Nail
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Rusty Nail', 'Whisky', 'build', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Grant''s Scotch Whisky', 30, 'ml', 1),
    (v_id, 'Drambuie', 30, 'ml', 2);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Grant''s Scotch Whisky (30 ml), Drambuie (30 ml).', 2);

  -- Godfather
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Godfather', 'Whisky', 'build', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Grant''s Scotch Whisky', 30, 'ml', 1),
    (v_id, 'Amaretto', 30, 'ml', 2);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Grant''s Scotch Whisky (30 ml), Amaretto (30 ml).', 2);

  -- Gin & Tonic
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Gin & Tonic', 'Gin', 'build', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Gin', 40, 'ml', 1),
    (v_id, 'Tonic', null, 'compléter', 2);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Gin (40 ml).', 2),
    (v_id, 'Compléter avec Tonic.', 3),
    (v_id, 'Décorer avec Quartier de citron vert.', 4);

  -- Cuba Libre
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Cuba Libre', 'Rhum', 'build', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Rhum blanc', 40, 'ml', 1),
    (v_id, 'Jus de citron vert frais', 10, 'ml', 2),
    (v_id, 'Coca-Cola', null, 'compléter', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Rhum blanc (40 ml), Jus de citron vert frais (10 ml).', 2),
    (v_id, 'Compléter avec Coca-Cola.', 3),
    (v_id, 'Décorer avec Quartier de citron vert.', 4);

  -- Black Russian
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Black Russian', 'Vodka', 'build', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 40, 'ml', 1),
    (v_id, 'Liqueur de café', 20, 'ml', 2);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Vodka (40 ml), Liqueur de café (20 ml).', 2);

  -- White Russian
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'White Russian', 'Vodka', 'build', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 40, 'ml', 1),
    (v_id, 'Liqueur de café', 20, 'ml', 2),
    (v_id, 'Lait', null, 'compléter', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Vodka (40 ml), Liqueur de café (20 ml).', 2),
    (v_id, 'Compléter avec Lait.', 3);

  -- Moscow Mule
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Moscow Mule', 'Vodka', 'build', 'Highball / Mug en cuivre', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 40, 'ml', 1),
    (v_id, 'Jus de citron vert frais', 10, 'ml', 2),
    (v_id, 'Ginger Beer', null, 'compléter', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball / Mug en cuivre de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Vodka (40 ml), Jus de citron vert frais (10 ml).', 2),
    (v_id, 'Compléter avec Ginger Beer.', 3),
    (v_id, 'Décorer avec Quartier de citron vert.', 4);

  -- Woo Woo
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Woo Woo', 'Vodka', 'build', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 40, 'ml', 1),
    (v_id, 'Peach Schnapps', 20, 'ml', 2),
    (v_id, 'Jus de cranberry', null, 'compléter', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Vodka (40 ml), Peach Schnapps (20 ml).', 2),
    (v_id, 'Compléter avec Jus de cranberry.', 3),
    (v_id, 'Décorer avec Quartier de citron vert.', 4);

  -- Americano
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Americano', 'Liqueur', 'stir', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vermouth rouge', 30, 'ml', 1),
    (v_id, 'Campari', 30, 'ml', 2),
    (v_id, 'Eau gazeuse', null, 'compléter', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Dans un verre à mélange, verser : Vermouth rouge (30 ml), Campari (30 ml).', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre Old fashioned.', 3),
    (v_id, 'Compléter avec Eau gazeuse.', 4),
    (v_id, 'Décorer avec Rondelle ou zeste d''orange.', 5);

  -- Screaming Orgasm
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Screaming Orgasm', 'Vodka', 'shake', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 10, 'ml', 1),
    (v_id, 'Liqueur de café', 10, 'ml', 2),
    (v_id, 'Amaretto', 10, 'ml', 3),
    (v_id, 'Baileys', 10, 'ml', 4),
    (v_id, 'Lait', 40, 'ml', 5);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Vodka (10 ml), Liqueur de café (10 ml), Amaretto (10 ml), Baileys (10 ml), Lait (40 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Old fashioned.', 3);

  -- El Diablo
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'El Diablo', 'Tequila', 'build', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Tequila', 30, 'ml', 1),
    (v_id, 'Crème de Cassis', 10, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 10, 'ml', 3),
    (v_id, 'Ginger Beer', null, 'compléter', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Tequila (30 ml), Crème de Cassis (10 ml), Jus de citron vert frais (10 ml).', 2),
    (v_id, 'Compléter avec Ginger Beer.', 3),
    (v_id, 'Décorer avec Quartier de citron vert.', 4);

  -- Sex on the Beach
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Sex on the Beach', 'Vodka', 'build', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 20, 'ml', 1),
    (v_id, 'Liqueur de pêche', 20, 'ml', 2),
    (v_id, 'Jus de cranberry', null, 'à parts égales', 3),
    (v_id, 'Jus d''orange', null, 'à parts égales', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Vodka (20 ml), Liqueur de pêche (20 ml).', 2),
    (v_id, 'Compléter avec Jus de cranberry.', 3),
    (v_id, 'Compléter avec Jus d''orange.', 4);

  -- Cosmopolitan
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Cosmopolitan', 'Vodka', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka citron', 40, 'ml', 1),
    (v_id, 'Triple Sec', 20, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 10, 'ml', 3),
    (v_id, 'Jus de cranberry', 30, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Vodka citron (40 ml), Triple Sec (20 ml), Jus de citron vert frais (10 ml), Jus de cranberry (30 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Zeste d''orange.', 4);

  -- Daiquiri
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Daiquiri', 'Rhum', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Rhum blanc', 60, 'ml', 1),
    (v_id, 'Jus de citron vert frais', 30, 'ml', 2),
    (v_id, 'Sirop de sucre', 15, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Rhum blanc (60 ml), Jus de citron vert frais (30 ml), Sirop de sucre (15 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3);

  -- French Martini
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'French Martini', 'Vodka', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 40, 'ml', 1),
    (v_id, 'Chambord', 20, 'ml', 2),
    (v_id, 'Jus d''ananas', 40, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Vodka (40 ml), Chambord (20 ml), Jus d''ananas (40 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec 1 framboise.', 4);

  -- Lynchburg Lemonade
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Lynchburg Lemonade', 'Whisky', 'shake', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Jack Daniel''s', 40, 'ml', 1),
    (v_id, 'Triple Sec', 20, 'ml', 2),
    (v_id, 'Jus de citron frais', 20, 'ml', 3),
    (v_id, 'Sirop de sucre', 10, 'ml', 4),
    (v_id, 'Sprite / Limonade', null, 'compléter', 5);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Jack Daniel''s (40 ml), Triple Sec (20 ml), Jus de citron frais (20 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Highball.', 3),
    (v_id, 'Compléter avec Sprite / Limonade.', 4),
    (v_id, 'Décorer avec Quartier de citron.', 5);

  -- Amaretto Sour
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Amaretto Sour', 'Liqueur', 'shake', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Angostura Bitters', 2, 'traits', 1),
    (v_id, 'Blanc d''œuf', 15, 'ml', 2),
    (v_id, 'Amaretto', 60, 'ml', 3),
    (v_id, 'Jus de citron frais', 30, 'ml', 4),
    (v_id, 'Sirop de sucre', 10, 'ml', 5);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Angostura Bitters (2 traits), Blanc d''œuf (15 ml), Amaretto (60 ml), Jus de citron frais (30 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer d''abord à sec, sans glace (dry shake), pour émulsionner le blanc d''œuf.', 3),
    (v_id, 'Ajouter de la glace, secouer à nouveau puis filtrer (fine strain) dans le verre Old fashioned.', 4),
    (v_id, 'Décorer avec Quartier de citron & cerise.', 5);

  -- Whiskey Sour
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Whiskey Sour', 'Whisky', 'shake', 'Sour Glass / Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Angostura Bitters', 2, 'traits', 1),
    (v_id, 'Blanc d''œuf', 15, 'ml', 2),
    (v_id, 'Bourbon', 60, 'ml', 3),
    (v_id, 'Jus de citron frais', 30, 'ml', 4),
    (v_id, 'Sirop de sucre', 15, 'ml', 5);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Sour Glass / Old fashioned de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Angostura Bitters (2 traits), Blanc d''œuf (15 ml), Bourbon (60 ml), Jus de citron frais (30 ml), Sirop de sucre (15 ml).', 2),
    (v_id, 'Secouer d''abord à sec, sans glace (dry shake), pour émulsionner le blanc d''œuf.', 3),
    (v_id, 'Ajouter de la glace, secouer à nouveau puis filtrer (fine strain) dans le verre Sour Glass / Old fashioned.', 4),
    (v_id, 'Décorer avec Zeste d''orange & cerise.', 5);

  -- Clover Club
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Clover Club', 'Gin', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Blanc d''œuf', 15, 'ml', 1),
    (v_id, 'Purée de framboise', 15, 'ml', 2),
    (v_id, 'Gin', 60, 'ml', 3),
    (v_id, 'Jus de citron frais', 30, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Blanc d''œuf (15 ml), Purée de framboise (15 ml), Gin (60 ml), Jus de citron frais (30 ml).', 2),
    (v_id, 'Secouer d''abord à sec, sans glace (dry shake), pour émulsionner le blanc d''œuf.', 3),
    (v_id, 'Ajouter de la glace, secouer à nouveau puis filtrer (fine strain) dans le verre Martini / Coupe.', 4),
    (v_id, 'Décorer avec 1 framboise.', 5);

  -- Horse's Neck
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Horse''s Neck', 'Whisky', 'build', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Angostura Bitters', 2, 'traits', 1),
    (v_id, 'Bourbon', 40, 'ml', 2),
    (v_id, 'Ginger Ale', null, 'compléter', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Angostura Bitters (2 traits), Bourbon (40 ml).', 2),
    (v_id, 'Compléter avec Ginger Ale.', 3),
    (v_id, 'Décorer avec Spirale de zeste de citron.', 4);

  -- Tom Collins
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Tom Collins', 'Gin', 'shake', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Gin', 60, 'ml', 1),
    (v_id, 'Jus de citron frais', 30, 'ml', 2),
    (v_id, 'Sirop de sucre', 15, 'ml', 3),
    (v_id, 'Eau gazeuse', null, 'compléter', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Gin (60 ml), Jus de citron frais (30 ml), Sirop de sucre (15 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Highball.', 3),
    (v_id, 'Compléter avec Eau gazeuse.', 4),
    (v_id, 'Décorer avec Quartier de citron.', 5);

  -- Long Island Iced Tea
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Long Island Iced Tea', 'Vodka', 'shake', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Rhum blanc', 20, 'ml', 1),
    (v_id, 'Vodka', 20, 'ml', 2),
    (v_id, 'Gin', 20, 'ml', 3),
    (v_id, 'Tequila', 20, 'ml', 4),
    (v_id, 'Triple Sec', 20, 'ml', 5),
    (v_id, 'Jus de citron frais', 20, 'ml', 6),
    (v_id, 'Sirop de sucre', 10, 'ml', 7),
    (v_id, 'Cola', null, 'compléter', 8);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Rhum blanc (20 ml), Vodka (20 ml), Gin (20 ml), Tequila (20 ml), Triple Sec (20 ml), Jus de citron frais (20 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Highball.', 3),
    (v_id, 'Compléter avec Cola.', 4),
    (v_id, 'Décorer avec Quartier de citron.', 5);

  -- Dry Martini
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Dry Martini', 'Gin', 'stir', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vermouth sec', null, 'barspoon', 1),
    (v_id, 'Gin (ou Vodka)', 60, 'ml', 2);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un verre à mélange, verser : Vermouth sec, Gin (ou Vodka) (60 ml).', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Olive(s) ou zeste de citron.', 4);

  -- Manhattan (Sweet)
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Manhattan (Sweet)', 'Whisky', 'stir', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Angostura Bitters', 2, 'traits', 1),
    (v_id, 'Vermouth rouge', 20, 'ml', 2),
    (v_id, 'Bourbon', 60, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un verre à mélange, verser : Angostura Bitters (2 traits), Vermouth rouge (20 ml), Bourbon (60 ml).', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec 1 cerise.', 4);

  -- Rob Roy
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Rob Roy', 'Whisky', 'stir', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Angostura Bitters', 2, 'traits', 1),
    (v_id, 'Vermouth rouge', 20, 'ml', 2),
    (v_id, 'Grant''s Scotch Whisky', 60, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un verre à mélange, verser : Angostura Bitters (2 traits), Vermouth rouge (20 ml), Grant''s Scotch Whisky (60 ml).', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec 1 cerise.', 4);

  -- Paloma
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Paloma', 'Tequila', 'shake', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Tequila', 60, 'ml', 1),
    (v_id, 'Jus de pamplemousse frais', 60, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 10, 'ml', 3),
    (v_id, 'Sirop de sucre', 10, 'ml', 4),
    (v_id, 'Eau gazeuse', null, 'compléter', 5);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Tequila (60 ml), Jus de pamplemousse frais (60 ml), Jus de citron vert frais (10 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Highball.', 3),
    (v_id, 'Compléter avec Eau gazeuse.', 4),
    (v_id, 'Décorer avec Bord salé & tranche de pamplemousse.', 5);

  -- Margarita
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Margarita', 'Tequila', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Tequila', 40, 'ml', 1),
    (v_id, 'Triple Sec', 20, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 30, 'ml', 3),
    (v_id, 'Sirop de sucre', 10, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Tequila (40 ml), Triple Sec (20 ml), Jus de citron vert frais (30 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Bord salé.', 4);

  -- Side Car
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Side Car', 'Cognac/Brandy', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Cognac', 40, 'ml', 1),
    (v_id, 'Triple Sec', 20, 'ml', 2),
    (v_id, 'Jus de citron frais', 30, 'ml', 3),
    (v_id, 'Sirop de sucre', 10, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Cognac (40 ml), Triple Sec (20 ml), Jus de citron frais (30 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Bord sucré.', 4);

  -- Bramble
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Bramble', 'Gin', 'shake', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Gin', 40, 'ml', 1),
    (v_id, 'Jus de citron frais', 20, 'ml', 2),
    (v_id, 'Sirop de sucre', 10, 'ml', 3),
    (v_id, 'Crème de Mûre', 20, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glace pilée.', 1),
    (v_id, 'Dans un shaker, verser : Gin (40 ml), Jus de citron frais (20 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Old fashioned.', 3),
    (v_id, 'Verser délicatement Crème de Mûre (20 ml) en flotte sur le dessus.', 4),
    (v_id, 'Décorer avec Quartier de citron & 2 mûres.', 5);

  -- Mojito
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Mojito', 'Rhum', 'muddle', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Quartiers de citron vert', 4, 'pièces', 1),
    (v_id, 'Sirop de sucre', 20, 'ml', 2),
    (v_id, 'Feuilles de menthe', null, '8 à 12 feuilles', 3),
    (v_id, 'Rhum blanc', 60, 'ml', 4),
    (v_id, 'Eau gazeuse', null, 'compléter', 5);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Piler les quartiers de citron vert avec le sirop de sucre et les feuilles de menthe au fond du verre.', 1),
    (v_id, 'Remplir le verre de glace pilée.', 2),
    (v_id, 'Verser le rhum blanc.', 3),
    (v_id, 'Compléter avec l''eau gazeuse et mélanger (churn).', 4),
    (v_id, 'Décorer avec un brin de menthe.', 5);

  -- Caipirinha
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Caipirinha', 'Rhum', 'muddle', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Quartiers de citron vert', 6, 'pièces', 1),
    (v_id, 'Sirop de sucre', 20, 'ml', 2),
    (v_id, 'Cachaça', 60, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Piler les quartiers de citron vert avec le sirop de sucre au fond du verre.', 1),
    (v_id, 'Remplir le verre de glace pilée.', 2),
    (v_id, 'Verser la cachaça et mélanger (churn).', 3),
    (v_id, 'Décorer avec un quartier de citron vert.', 4);

  -- Mint Julep
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Mint Julep', 'Whisky', 'muddle', 'Old fashioned / Julep Tin', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Sucre imbibé d''Angostura Bitters', 1, 'morceau', 1),
    (v_id, 'Eau gazeuse', 1, 'barspoon', 2),
    (v_id, 'Feuilles de menthe', null, '8 à 12 feuilles', 3),
    (v_id, 'Bourbon', 60, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Imbiber le morceau de sucre d''Angostura Bitters et le déposer au fond du verre avec l''eau gazeuse.', 1),
    (v_id, 'Piler légèrement le sucre puis ajouter les feuilles de menthe et les presser doucement (bash).', 2),
    (v_id, 'Remplir le verre de glace pilée.', 3),
    (v_id, 'Verser le bourbon et mélanger (churn).', 4),
    (v_id, 'Décorer avec un brin de menthe.', 5);

  -- Gin Basil Smash
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Gin Basil Smash', 'Gin', 'shake', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Feuilles de basilic', null, '8 à 12 feuilles', 1),
    (v_id, 'Gin', 60, 'ml', 2),
    (v_id, 'Jus de citron frais', 30, 'ml', 3),
    (v_id, 'Sirop de sucre', 15, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Feuilles de basilic, Gin (60 ml), Jus de citron frais (30 ml), Sirop de sucre (15 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Old fashioned.', 3),
    (v_id, 'Décorer avec Feuille de basilic.', 4);

  -- Southside
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Southside', 'Gin', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Feuilles de menthe', null, '8 à 12 feuilles', 1),
    (v_id, 'Gin', 60, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 30, 'ml', 3),
    (v_id, 'Sirop de sucre', 15, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Feuilles de menthe, Gin (60 ml), Jus de citron vert frais (30 ml), Sirop de sucre (15 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec 1 feuille de menthe.', 4);

  -- B52
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'B52', 'Liqueur', 'autre', 'Shooter', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Liqueur de café', 20, 'ml', 1),
    (v_id, 'Baileys', 20, 'ml', 2),
    (v_id, 'Triple Sec', 20, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Verser délicatement la liqueur de café au fond du shooter.', 1),
    (v_id, 'Verser délicatement le Baileys par-dessus, sur le dos d''une cuillère, pour former une couche distincte.', 2),
    (v_id, 'Verser délicatement le Triple Sec par-dessus en dernière couche.', 3);

  -- Pornstar Martini
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Pornstar Martini', 'Vodka', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 40, 'ml', 1),
    (v_id, 'Liqueur de fruit de la passion', 20, 'ml', 2),
    (v_id, 'Purée de fruit de la passion', 20, 'ml', 3),
    (v_id, 'Jus de citron vert frais', 20, 'ml', 4),
    (v_id, 'Sirop de vanille', 10, 'ml', 5);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Vodka (40 ml), Liqueur de fruit de la passion (20 ml), Purée de fruit de la passion (20 ml), Jus de citron vert frais (20 ml), Sirop de vanille (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec 1/2 fruit de la passion — servi avec un shot de Champagne à part.', 4);

  -- Bellini
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Bellini', 'Vin/Champagne', 'build', 'Flûte à champagne', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Purée de pêche fraîche', 10, 'ml', 1),
    (v_id, 'Liqueur de pêche', 10, 'ml', 2),
    (v_id, 'Prosecco', null, 'compléter', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Verser la purée de pêche et la liqueur de pêche dans la flûte.', 1),
    (v_id, 'Compléter avec le prosecco et mélanger doucement.', 2);

  -- French 75
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'French 75', 'Gin', 'shake', 'Flûte à champagne', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Gin', 40, 'ml', 1),
    (v_id, 'Jus de citron frais', 20, 'ml', 2),
    (v_id, 'Sirop de sucre', 10, 'ml', 3),
    (v_id, 'Champagne', null, 'compléter', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Flûte à champagne au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Gin (40 ml), Jus de citron frais (20 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Flûte à champagne.', 3),
    (v_id, 'Compléter avec Champagne.', 4),
    (v_id, 'Décorer avec Zeste de citron.', 5);

  -- Last Word
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Last Word', 'Gin', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Gin', 20, 'ml', 1),
    (v_id, 'Maraschino', 20, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 20, 'ml', 3),
    (v_id, 'Chartreuse verte', 20, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Gin (20 ml), Maraschino (20 ml), Jus de citron vert frais (20 ml), Chartreuse verte (20 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Cerise.', 4);

  -- Old Fashioned
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Old Fashioned', 'Whisky', 'stir', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Angostura Bitters', 2, 'traits', 1),
    (v_id, 'Bourbon', 60, 'ml', 2),
    (v_id, 'Sirop de sucre', 10, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Dans un verre à mélange, verser : Angostura Bitters (2 traits), Bourbon (60 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre Old fashioned.', 3),
    (v_id, 'Décorer avec Zeste d''orange.', 4);

  -- Dark & Stormy
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Dark & Stormy', 'Rhum', 'build', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Jus de citron vert frais', 20, 'ml', 1),
    (v_id, 'Ginger Beer', null, 'compléter', 2),
    (v_id, 'Rhum brun', 40, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball de glaçons.', 1),
    (v_id, 'Verser directement dans le verre : Jus de citron vert frais (20 ml).', 2),
    (v_id, 'Compléter avec Ginger Beer.', 3),
    (v_id, 'Verser délicatement Rhum brun (40 ml) en flotte sur le dessus.', 4),
    (v_id, 'Décorer avec Quartier de citron vert.', 5);

  -- Hemingway Daiquiri
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Hemingway Daiquiri', 'Rhum', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Rhum blanc', 50, 'ml', 1),
    (v_id, 'Maraschino', 10, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 20, 'ml', 3),
    (v_id, 'Jus de pamplemousse', 20, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Rhum blanc (50 ml), Maraschino (10 ml), Jus de citron vert frais (20 ml), Jus de pamplemousse (20 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec 1 cerise.', 4);

  -- White Lady
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'White Lady', 'Gin', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Gin', 40, 'ml', 1),
    (v_id, 'Triple Sec', 20, 'ml', 2),
    (v_id, 'Jus de citron frais', 30, 'ml', 3),
    (v_id, 'Sirop de sucre', 10, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Gin (40 ml), Triple Sec (20 ml), Jus de citron frais (30 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Zeste de citron.', 4);

  -- Bloody Mary
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Bloody Mary', 'Vodka', 'autre', 'Highball', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 40, 'ml', 1),
    (v_id, 'Jus de citron frais', 10, 'ml', 2),
    (v_id, 'Bloody Mary Pre-Batch', 120, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Préparer le pré-mix Bloody Mary (pour une bouteille de 700ml) : 30ml de sauce Worcestershire, 10ml de Tabasco, 2g de poivre noir, 4g de sel de céleri, compléter avec du jus de tomate.', 1),
    (v_id, 'Dans un verre à mélange, verser la vodka, le jus de citron frais et le pré-mix Bloody Mary.', 2),
    (v_id, 'Rouler le mélange (roll) entre deux verres pour l''homogénéiser sans trop diluer, puis verser dans le verre highball avec de la glace.', 3),
    (v_id, 'Décorer avec un bâton de céleri.', 4);

  -- Negroni
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Negroni', 'Gin', 'stir', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vermouth rouge', 30, 'ml', 1),
    (v_id, 'Campari', 30, 'ml', 2),
    (v_id, 'Gin', 30, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Dans un verre à mélange, verser : Vermouth rouge (30 ml), Campari (30 ml), Gin (30 ml).', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre Old fashioned.', 3),
    (v_id, 'Décorer avec Zeste ou rondelle d''orange.', 4);

  -- Boulevardier
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Boulevardier', 'Whisky', 'stir', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vermouth rouge', 30, 'ml', 1),
    (v_id, 'Campari', 30, 'ml', 2),
    (v_id, 'Bourbon ou Rye', 30, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned de glaçons.', 1),
    (v_id, 'Dans un verre à mélange, verser : Vermouth rouge (30 ml), Campari (30 ml), Bourbon ou Rye (30 ml).', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre Old fashioned.', 3),
    (v_id, 'Décorer avec Zeste ou rondelle d''orange.', 4);

  -- Aperol Spritz
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Aperol Spritz', 'Vin/Champagne', 'build', 'Old fashioned / Verre à vin', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Prosecco', 60, 'ml', 1),
    (v_id, 'Aperol', 40, 'ml', 2),
    (v_id, 'Eau gazeuse', 20, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre de glaçons.', 1),
    (v_id, 'Verser le prosecco, puis l''Aperol, puis l''eau gazeuse, dans cet ordre.', 2),
    (v_id, 'Mélanger délicatement.', 3),
    (v_id, 'Décorer avec une tranche d''orange.', 4);

  -- Mimosa
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Mimosa', 'Vin/Champagne', 'build', 'Flûte à champagne', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Jus d''orange', 1, 'part', 1),
    (v_id, 'Champagne', 1, 'part', 2);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Verser une part de jus d''orange dans la flûte.', 1),
    (v_id, 'Compléter avec une part de champagne.', 2);

  -- Espresso Martini
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Espresso Martini', 'Vodka', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 40, 'ml', 1),
    (v_id, 'Liqueur de café', 20, 'ml', 2),
    (v_id, 'Café espresso', 1, 'shot', 3),
    (v_id, 'Sirop de sucre', 10, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Vodka (40 ml), Liqueur de café (20 ml), Café espresso (1 shot), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec 3 grains de café.', 4);

  -- Brandy Alexander
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Brandy Alexander', 'Cognac/Brandy', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Brandy', 40, 'ml', 1),
    (v_id, 'Liqueur de cacao noir', 20, 'ml', 2),
    (v_id, 'Lait', 40, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Brandy (40 ml), Liqueur de cacao noir (20 ml), Lait (40 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Noix de muscade râpée.', 4);

  -- Grasshopper
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Grasshopper', 'Liqueur', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Crème de menthe', 30, 'ml', 1),
    (v_id, 'Liqueur de cacao blanc', 30, 'ml', 2),
    (v_id, 'Lait', 40, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Crème de menthe (30 ml), Liqueur de cacao blanc (30 ml), Lait (40 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3);

  -- Mai Tai
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Mai Tai', 'Rhum', 'shake', 'Old fashioned / Tiki Mug', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Rhum brun', 40, 'ml', 1),
    (v_id, 'Triple Sec', 10, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 20, 'ml', 3),
    (v_id, 'Sirop d''orgeat', 10, 'ml', 4),
    (v_id, 'Rhum overproof', 10, 'ml', 5);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Old fashioned / Tiki Mug de glace pilée.', 1),
    (v_id, 'Dans un shaker, verser : Rhum brun (40 ml), Triple Sec (10 ml), Jus de citron vert frais (20 ml), Sirop d''orgeat (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Old fashioned / Tiki Mug.', 3),
    (v_id, 'Verser délicatement Rhum overproof (10 ml) en flotte sur le dessus.', 4),
    (v_id, 'Décorer avec Brin de menthe.', 5);

  -- Kir Royal
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Kir Royal', 'Vin/Champagne', 'build', 'Flûte à champagne', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Crème de Cassis', 20, 'ml', 1),
    (v_id, 'Champagne', null, 'compléter', 2);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Flûte à champagne au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Verser directement dans le verre : Crème de Cassis (20 ml).', 2),
    (v_id, 'Compléter avec Champagne.', 3);

  -- Classic Champagne Cocktail
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Classic Champagne Cocktail', 'Vin/Champagne', 'build', 'Flûte à champagne', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Sucre imbibé d''Angostura Bitters', 1, 'morceau', 1),
    (v_id, 'Cognac', 20, 'ml', 2),
    (v_id, 'Champagne', null, 'compléter', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Déposer le morceau de sucre imbibé d''Angostura Bitters au fond de la flûte.', 1),
    (v_id, 'Verser le cognac.', 2),
    (v_id, 'Compléter avec le champagne.', 3);

  -- Blood & Sand
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Blood & Sand', 'Whisky', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Grant''s Scotch Whisky', 20, 'ml', 1),
    (v_id, 'Vermouth rouge', 20, 'ml', 2),
    (v_id, 'Cherry Brandy', 20, 'ml', 3),
    (v_id, 'Jus d''orange', 20, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Grant''s Scotch Whisky (20 ml), Vermouth rouge (20 ml), Cherry Brandy (20 ml), Jus d''orange (20 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Zeste d''orange.', 4);

  -- Apple Martini
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Apple Martini', 'Vodka', 'shake', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 40, 'ml', 1),
    (v_id, 'Liqueur de pomme', 20, 'ml', 2),
    (v_id, 'Jus de citron frais', 30, 'ml', 3),
    (v_id, 'Sirop de sucre', 10, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Vodka (40 ml), Liqueur de pomme (20 ml), Jus de citron frais (30 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Zeste de citron.', 4);

  -- Kamikaze
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Kamikaze', 'Vodka', 'shake', 'Shooter', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 20, 'ml', 1),
    (v_id, 'Triple Sec', 10, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 10, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Shooter au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Vodka (20 ml), Triple Sec (10 ml), Jus de citron vert frais (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Shooter.', 3);

  -- Singapore Sling
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Singapore Sling', 'Gin', 'shake', 'Highball / Sling', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Angostura Bitters', 1, 'trait', 1),
    (v_id, 'Grenadine', 1, 'trait', 2),
    (v_id, 'Bénédictine D.O.M', 5, 'ml', 3),
    (v_id, 'Triple Sec', 5, 'ml', 4),
    (v_id, 'Cherry Brandy', 10, 'ml', 5),
    (v_id, 'Jus de citron vert frais', 20, 'ml', 6),
    (v_id, 'Gin', 20, 'ml', 7),
    (v_id, 'Jus d''ananas', 80, 'ml', 8);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball / Sling de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Angostura Bitters (1 trait), Grenadine (1 trait), Bénédictine D.O.M (5 ml), Triple Sec (5 ml), Cherry Brandy (10 ml), Jus de citron vert frais (20 ml), Gin (20 ml), Jus d''ananas (80 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Highball / Sling.', 3),
    (v_id, 'Décorer avec Quartier d''ananas & cerise.', 4);

  -- Gimlet
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Gimlet', 'Gin', 'stir', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Gin', 60, 'ml', 1),
    (v_id, 'Lime Cordial', 10, 'ml', 2);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un verre à mélange, verser : Gin (60 ml), Lime Cordial (10 ml).', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Zeste de citron vert.', 4);

  -- Martinez
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Martinez', 'Gin', 'stir', 'Martini / Coupe', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Orange Bitters', 2, 'traits', 1),
    (v_id, 'Maraschino', 1, 'barspoon', 2),
    (v_id, 'Vermouth rouge', 20, 'ml', 3),
    (v_id, 'Gin', 60, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Martini / Coupe au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un verre à mélange, verser : Orange Bitters (2 traits), Maraschino (1 barspoon), Vermouth rouge (20 ml), Gin (60 ml).', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre Martini / Coupe.', 3),
    (v_id, 'Décorer avec Zeste de citron.', 4);

  -- Sazerac
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Sazerac', 'Cognac/Brandy', 'stir', 'Old fashioned', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Absinthe', null, 'rinçage du verre', 1),
    (v_id, 'Peychaud''s Bitters', 3, 'traits', 2),
    (v_id, 'Cognac ou Rye', 60, 'ml', 3),
    (v_id, 'Sirop de sucre', 10, 'ml', 4);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Rincer le verre d''absinthe et jeter le surplus.', 1),
    (v_id, 'Dans un verre à mélange, verser les Peychaud''s Bitters, le cognac (ou rye) et le sirop de sucre.', 2),
    (v_id, 'Remuer avec de la glace puis filtrer (julep strain) dans le verre rincé à l''absinthe.', 3),
    (v_id, 'Décorer avec un zeste de citron.', 4);

  -- Zombie
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Zombie', 'Rhum', 'shake', 'Highball / Tiki Mug', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Angostura Bitters', 4, 'traits', 1),
    (v_id, 'Absinthe', 2, 'traits', 2),
    (v_id, 'Rhum overproof', 10, 'ml', 3),
    (v_id, 'Rhum brun', 20, 'ml', 4),
    (v_id, 'Rhum blanc', 20, 'ml', 5),
    (v_id, 'Grenadine', 10, 'ml', 6),
    (v_id, 'Sirop de cannelle', 20, 'ml', 7),
    (v_id, 'Jus de citron vert frais', 20, 'ml', 8),
    (v_id, 'Jus de pamplemousse', 20, 'ml', 9);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball / Tiki Mug de glace pilée.', 1),
    (v_id, 'Dans un shaker, verser : Angostura Bitters (4 traits), Absinthe (2 traits), Rhum overproof (10 ml), Rhum brun (20 ml), Rhum blanc (20 ml), Grenadine (10 ml), Sirop de cannelle (20 ml), Jus de citron vert frais (20 ml), Jus de pamplemousse (20 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Highball / Tiki Mug.', 3),
    (v_id, 'Décorer avec Brin de menthe.', 4);

  -- Piña Colada (Quick)
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Piña Colada (Quick)', 'Rhum', 'shake', 'Highball / Hurricane', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Rhum blanc', 40, 'ml', 1),
    (v_id, 'Liqueur de coco', 20, 'ml', 2),
    (v_id, 'Jus de citron vert frais', 10, 'ml', 3),
    (v_id, 'Jus d''ananas', 60, 'ml', 4),
    (v_id, 'Crème de coco', 40, 'ml', 5);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Remplir le verre Highball / Hurricane de glaçons.', 1),
    (v_id, 'Dans un shaker, verser : Rhum blanc (40 ml), Liqueur de coco (20 ml), Jus de citron vert frais (10 ml), Jus d''ananas (60 ml), Crème de coco (40 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Highball / Hurricane.', 3),
    (v_id, 'Décorer avec Quartier d''ananas & cerise.', 4);

  -- Lemon Drop
  insert into public.cocktails (createur_id, nom, categorie_alcool, technique, type_verre, est_classique)
  values (v_admin_id, 'Lemon Drop', 'Vodka', 'shake', 'Shooter', true)
  returning id into v_id;
  insert into public.cocktail_ingredients (cocktail_id, ingredient_nom, quantite, unite, ordre) values
    (v_id, 'Vodka', 20, 'ml', 1),
    (v_id, 'Jus de citron frais', 10, 'ml', 2),
    (v_id, 'Sirop de sucre', 10, 'ml', 3);
  insert into public.cocktail_etapes (cocktail_id, texte, ordre) values
    (v_id, 'Passer le verre Shooter au congélateur pour bien le rafraîchir.', 1),
    (v_id, 'Dans un shaker, verser : Vodka (20 ml), Jus de citron frais (10 ml), Sirop de sucre (10 ml).', 2),
    (v_id, 'Secouer avec de la glace puis filtrer dans le verre Shooter.', 3),
    (v_id, 'Décorer avec Bord sucré, quartier de citron.', 4);

end $$;