ALTER TABLE public.producteurs ADD COLUMN IF NOT EXISTS ville text;
ALTER TABLE public.producteurs ADD COLUMN IF NOT EXISTS type_produit text;
ALTER TABLE public.suggestions_producteurs ADD COLUMN IF NOT EXISTS ville text;
ALTER TABLE public.suggestions_producteurs ADD COLUMN IF NOT EXISTS type_produit text;
