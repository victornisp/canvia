-- ============================================
-- POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY
-- ============================================
-- Ejecuta este script en Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Pega y ejecuta

-- 1. Habilitar RLS en todas las tablas
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_tags ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLÍTICAS PARA TABLA: cards
-- ============================================

-- Permitir que los usuarios vean solo sus propias cartas
CREATE POLICY "Users can view their own cards"
  ON cards FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir que los usuarios inserten solo sus propias cartas
CREATE POLICY "Users can insert their own cards"
  ON cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permitir que los usuarios actualicen solo sus propias cartas
CREATE POLICY "Users can update their own cards"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id);

-- Permitir que los usuarios eliminen solo sus propias cartas
CREATE POLICY "Users can delete their own cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. POLÍTICAS PARA TABLA: tags
-- ============================================

-- Permitir que los usuarios vean solo sus propios tags
CREATE POLICY "Users can view their own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir que los usuarios creen sus propios tags
CREATE POLICY "Users can insert their own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permitir que los usuarios actualicen sus propios tags
CREATE POLICY "Users can update their own tags"
  ON tags FOR UPDATE
  USING (auth.uid() = user_id);

-- Permitir que los usuarios eliminen sus propios tags
CREATE POLICY "Users can delete their own tags"
  ON tags FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. POLÍTICAS PARA TABLA: card_tags
-- ============================================

-- Permitir que los usuarios gestionen tags de sus propias cartas
CREATE POLICY "Users can manage tags on their cards"
  ON card_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_tags.card_id
      AND cards.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. POLÍTICAS PARA TABLA: card_relationships
-- ============================================

-- Permitir que los usuarios gestionen relaciones de sus propias cartas
CREATE POLICY "Users can manage relationships on their cards"
  ON card_relationships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_relationships.from_card_id
      AND cards.user_id = auth.uid()
    )
  );

-- ============================================
-- 6. VERIFICACIÓN
-- ============================================
-- Para verificar que las políticas están activas:
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
