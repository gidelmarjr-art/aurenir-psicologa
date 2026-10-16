import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createProduct, deleteProduct, fetchAllProducts, reorderProducts, updateProduct, uploadProductImage,
} from '../../services/products'
import ProductCard from '../../components/product-card/ProductCard'
import { IconDown, IconEdit, IconPlus, IconTrash, IconUp } from '../icons/Icons'
import './AdminProducts.css'

const EMPTY = { id: null, title: '', buyUrl: '', imageUrl: '', active: true }
const MAX_IMAGE_MB = 3

export default function AdminProducts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null) // { type: 'ok' | 'error', text }
  const fileInput = useRef(null)

  const load = useCallback(async () => {
    try {
      setItems(await fetchAllProducts())
    } catch {
      setMsg({ type: 'error', text: 'Não foi possível carregar os produtos.' })
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { load() }, [load])

  // Prévia da imagem escolhida (antes de enviar)
  useEffect(() => {
    if (!file) { setFilePreview(''); return }
    const url = URL.createObjectURL(file)
    setFilePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const resetForm = () => {
    setForm(EMPTY)
    setFile(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  const onFile = (e) => {
    const chosen = e.target.files?.[0]
    if (!chosen) return
    if (!chosen.type.startsWith('image/')) { setMsg({ type: 'error', text: 'Escolha um arquivo de imagem (PNG, JPG ou WebP).' }); e.target.value = ''; return }
    if (chosen.size > MAX_IMAGE_MB * 1024 * 1024) { setMsg({ type: 'error', text: `A imagem tem mais de ${MAX_IMAGE_MB} MB. Use uma menor.` }); e.target.value = ''; return }
    setMsg(null)
    setFile(chosen)
  }

  const startEdit = (p) => {
    setMsg(null)
    setFile(null)
    if (fileInput.current) fileInput.current.value = ''
    setForm({ id: p.id, title: p.title, buyUrl: p.buyUrl, imageUrl: p.imageUrl, active: p.active })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const title = form.title.trim()
    const buyUrl = form.buyUrl.trim()
    if (title.length < 2) return setMsg({ type: 'error', text: 'Informe o nome do material.' })
    if (!/^https?:\/\//i.test(buyUrl)) return setMsg({ type: 'error', text: 'O link de compra precisa começar com http:// ou https://' })
    if (!file && !form.imageUrl) return setMsg({ type: 'error', text: 'Escolha a imagem de capa.' })

    setSaving(true)
    setMsg(null)
    try {
      const imageUrl = file ? await uploadProductImage(file) : form.imageUrl
      if (form.id) {
        await updateProduct(form.id, { title, buyUrl, imageUrl, active: form.active })
      } else {
        const position = items.reduce((max, p) => Math.max(max, p.position), 0) + 1
        await createProduct({ title, buyUrl, imageUrl, active: form.active, position })
      }
      setMsg({ type: 'ok', text: form.id ? 'Produto atualizado.' : 'Produto cadastrado. Já aparece no site.' })
      resetForm()
      await load()
    } catch {
      setMsg({ type: 'error', text: 'Não foi possível salvar. Confira a conexão e tente de novo.' })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (p) => {
    try { await updateProduct(p.id, { active: !p.active }); await load() }
    catch { setMsg({ type: 'error', text: 'Não foi possível alterar o produto.' }) }
  }

  const move = async (index, dir) => {
    const next = [...items]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
    try { await reorderProducts(next); await load() }
    catch { setMsg({ type: 'error', text: 'Não foi possível mudar a ordem.' }); await load() }
  }

  const remove = async (p) => {
    if (!window.confirm(`Apagar "${p.title}"? Isso não pode ser desfeito. (Para só esconder do site, use o botão Ativo.)`)) return
    try {
      await deleteProduct(p.id)
      if (form.id === p.id) resetForm()
      setMsg({ type: 'ok', text: 'Produto apagado.' })
      await load()
    } catch { setMsg({ type: 'error', text: 'Não foi possível apagar o produto.' }) }
  }

  const previewImage = filePreview || form.imageUrl

  return (
    <>
      <header className="ad-page-head">
        <h1>Produtos</h1>
        <p>Cadastre os materiais que aparecem na seção "Materiais indicados" do site.</p>
      </header>

      {msg && <p className={`ad-msg ad-msg--${msg.type}`} role={msg.type === 'error' ? 'alert' : 'status'}>{msg.text}</p>}

      <div className="ad-prod">
        {/* ----- formulário + prévia ----- */}
        <section className="ad-card ad-prod__form-card" aria-label="Cadastro de produto">
          <h2 className="ad-card__title">{form.id ? 'Editar produto' : 'Novo produto'}</h2>

          <form className="ad-prod__form" onSubmit={handleSave}>
            <div className="ad-field">
              <label htmlFor="pr-titulo">Nome do material</label>
              <input id="pr-titulo" className="ad-input" value={form.title} onChange={setField('title')} maxLength={160} placeholder="Ex.: Oficina de Acolhida para Estudantes" />
            </div>
            <div className="ad-field">
              <label htmlFor="pr-link">Link de compra</label>
              <input id="pr-link" className="ad-input" type="url" value={form.buyUrl} onChange={setField('buyUrl')} placeholder="https://..." />
            </div>
            <div className="ad-field">
              <label htmlFor="pr-img">Capa {form.id && '(deixe vazio para manter a atual)'}</label>
              <input id="pr-img" ref={fileInput} className="ad-input" type="file" accept="image/*" onChange={onFile} />
              <span className="ad-hint">Imagem quadrada, de preferência com 800×800 px ou mais. Até {MAX_IMAGE_MB} MB.</span>
            </div>
            <label className="ad-prod__check">
              <input type="checkbox" checked={form.active} onChange={setField('active')} />
              Mostrar no site
            </label>

            <div className="ad-prod__actions">
              <button className="ad-btn ad-btn--primary" type="submit" disabled={saving}>
                {saving ? 'Salvando…' : form.id ? 'Salvar alterações' : <><IconPlus /> Cadastrar produto</>}
              </button>
              {(form.id || file || form.title || form.buyUrl) && (
                <button className="ad-btn ad-btn--ghost" type="button" onClick={() => { resetForm(); setMsg(null) }}>Cancelar</button>
              )}
            </div>
          </form>

        </section>

        <div className="ad-prod__side">
          <section className="ad-card ad-prod__preview-card" aria-label="Prévia no site">
          <div className="ad-prod__preview">
            <h3 className="ad-prod__preview-title">Prévia no site</h3>
            <div className="ad-prod__stage">
              <div className="ad-prod__panel">
                <p className="ad-prod__panel-title">Materiais indicados</p>
                <div className="ad-prod__card">
                  <ProductCard preview title={form.title.trim() || 'Nome do material'} imageUrl={previewImage} buyUrl={form.buyUrl} />
                </div>
              </div>
            </div>
          </div>
          </section>

        {/* ----- lista ----- */}
        <section className="ad-card ad-prod__list-card" aria-label="Produtos cadastrados">
          <h2 className="ad-card__title">Cadastrados ({items.length})</h2>
          {loading && <p className="ad-hint">Carregando…</p>}
          {!loading && items.length === 0 && <p className="ad-prod__empty">Nenhum produto ainda. Cadastre o primeiro ao lado.</p>}

          <ul className="ad-prod__list">
            {items.map((p, i) => (
              <li key={p.id} className={`ad-prod__row ${p.active ? '' : 'ad-prod__row--off'}`}>
                <img className="ad-prod__thumb" src={p.imageUrl} alt="" />
                <div className="ad-prod__info">
                  <strong className="ad-prod__name">{p.title}</strong>
                  <a className="ad-prod__url" href={p.buyUrl} target="_blank" rel="noopener noreferrer">{p.buyUrl}</a>
                  <button type="button" className={`ad-badge ad-prod__toggle ${p.active ? 'ad-badge--ok' : ''}`} onClick={() => toggleActive(p)} aria-pressed={p.active}>
                    {p.active ? 'Ativo no site' : 'Escondido'}
                  </button>
                </div>
                <div className="ad-prod__tools">
                  <button className="ad-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Subir ${p.title}`}><IconUp /></button>
                  <button className="ad-icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Descer ${p.title}`}><IconDown /></button>
                  <button className="ad-icon-btn" onClick={() => startEdit(p)} aria-label={`Editar ${p.title}`}><IconEdit /></button>
                  <button className="ad-icon-btn ad-icon-btn--danger" onClick={() => remove(p)} aria-label={`Apagar ${p.title}`}><IconTrash /></button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        </div>
      </div>
    </>
  )
}
