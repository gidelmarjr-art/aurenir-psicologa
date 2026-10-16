import { supabase } from '../lib/supabase'
import { products as staticProducts } from '../data/siteData'

const BUCKET = 'product-images'

const toProduct = (row) => ({
  id: row.id,
  title: row.title,
  imageUrl: row.image_url,
  buyUrl: row.buy_url,
  active: row.active,
  position: row.position,
})

/** Lista usada quando o banco ainda não foi configurado (.env vazio). */
export const fallbackProducts = staticProducts.map((p, i) => ({
  id: p.id,
  title: p.title,
  imageUrl: p.image,
  buyUrl: p.link,
  active: true,
  position: i + 1,
}))

// ---------- site público ----------
export async function fetchPublicProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, image_url, buy_url, active, position')
    .eq('active', true)
    .order('position', { ascending: true })
  if (error) throw error
  return data.map(toProduct)
}

/** Conta o clique no "Comprar". Nunca atrapalha o visitante se falhar. */
export function trackProductClick(productId) {
  if (!supabase) return
  supabase.from('product_clicks').insert({ product_id: productId }).then(() => {}, () => {})
}

// ---------- painel admin ----------
export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, image_url, buy_url, active, position')
    .order('position', { ascending: true })
  if (error) throw error
  return data.map(toProduct)
}

export async function createProduct({ title, imageUrl, buyUrl, active, position }) {
  const { error } = await supabase
    .from('products')
    .insert({ title, image_url: imageUrl, buy_url: buyUrl, active, position })
  if (error) throw error
}

export async function updateProduct(id, patch) {
  const row = {}
  if ('title' in patch) row.title = patch.title
  if ('imageUrl' in patch) row.image_url = patch.imageUrl
  if ('buyUrl' in patch) row.buy_url = patch.buyUrl
  if ('active' in patch) row.active = patch.active
  if ('position' in patch) row.position = patch.position
  const { error } = await supabase.from('products').update(row).eq('id', id)
  if (error) throw error
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

/** Salva a nova ordem: recebe a lista já na ordem desejada e grava só o que mudou. */
export async function reorderProducts(ordered) {
  const changes = ordered
    .map((p, i) => ({ id: p.id, position: i + 1, old: p.position }))
    .filter((c) => c.position !== c.old)
  await Promise.all(changes.map((c) => updateProduct(c.id, { position: c.position })))
}

/** Envia a capa para o Storage e devolve o endereço público da imagem. */
export async function uploadProductImage(file) {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${crypto.randomUUID()}.${ext || 'png'}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000' })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
