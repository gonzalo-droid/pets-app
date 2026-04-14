'use client'

import { useState } from 'react'
import { Save, Plus, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MOCK_SHELTERS, MOCK_SHELTER_PHOTOS } from '@/lib/mock/shelters'
import type { Shelter, ShelterPhoto } from '@/types'

// Mock: albergue activo hardcodeado (sin auth real)
const MOCK_SHELTER_ID = 'shelter-001'
const initialShelter = MOCK_SHELTERS.find((s) => s.id === MOCK_SHELTER_ID)!
const initialPhotos = MOCK_SHELTER_PHOTOS.filter((p) => p.shelter_id === MOCK_SHELTER_ID)

export default function ShelterSettingsPage() {
  const [info, setInfo] = useState({
    name: initialShelter.name,
    description: initialShelter.description ?? '',
    long_description: initialShelter.long_description ?? '',
    address: initialShelter.address ?? '',
    avatar_url: initialShelter.avatar_url ?? '',
    banner_url: initialShelter.banner_url ?? '',
  })

  const [contact, setContact] = useState({
    phone: initialShelter.phone ?? '',
    email: initialShelter.email ?? '',
    whatsapp: initialShelter.whatsapp ?? '',
    instagram: initialShelter.instagram ?? '',
    facebook: initialShelter.facebook ?? '',
    tiktok: initialShelter.tiktok ?? '',
  })

  const [photos, setPhotos] = useState<ShelterPhoto[]>(initialPhotos)
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedTab, setSavedTab] = useState<string | null>(null)

  function handleSave(tab: string) {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSavedTab(tab)
      setTimeout(() => setSavedTab(null), 2500)
    }, 500)
  }

  function addPhoto() {
    const url = newPhotoUrl.trim()
    if (!url || photos.length >= 12) return
    const newPhoto: ShelterPhoto = {
      id: `sp-new-${Date.now()}`,
      shelter_id: MOCK_SHELTER_ID,
      url,
      order_index: photos.length,
    }
    setPhotos((prev) => [...prev, newPhoto])
    setNewPhotoUrl('')
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración del albergue</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Esta información se mostrará públicamente en el perfil del albergue.
        </p>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="contact">Contacto & Redes</TabsTrigger>
          <TabsTrigger value="gallery">Galería</TabsTrigger>
        </TabsList>

        {/* ── Tab: Información ── */}
        <TabsContent value="info">
          <div className="flex flex-col gap-5">
            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              {info.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={info.avatar_url}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full border-2 border-border object-cover bg-muted"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-accent text-2xl">
                  🏠
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="avatar_url">URL del avatar</Label>
                <Input
                  id="avatar_url"
                  value={info.avatar_url}
                  onChange={(e) => setInfo((p) => ({ ...p, avatar_url: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Banner preview */}
            <div>
              <Label htmlFor="banner_url">URL del banner</Label>
              {info.banner_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={info.banner_url}
                  alt="Banner"
                  className="mt-2 w-full h-28 object-cover rounded-lg border border-border bg-muted mb-2"
                />
              )}
              <Input
                id="banner_url"
                value={info.banner_url}
                onChange={(e) => setInfo((p) => ({ ...p, banner_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="name">Nombre del albergue</Label>
              <Input
                id="name"
                value={info.name}
                onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">
                Descripción corta{' '}
                <span className="text-muted-foreground font-normal">
                  ({(info.description ?? '').length}/200 caracteres)
                </span>
              </Label>
              <Textarea
                id="description"
                value={info.description ?? ''}
                onChange={(e) => setInfo((p) => ({ ...p, description: e.target.value.slice(0, 200) }))}
                rows={2}
                placeholder="Resumen breve del albergue..."
                className="mt-1 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="long_description">Historia del albergue</Label>
              <Textarea
                id="long_description"
                value={info.long_description ?? ''}
                onChange={(e) => setInfo((p) => ({ ...p, long_description: e.target.value }))}
                rows={8}
                placeholder="Cuenta la historia, misión y valores de tu albergue..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={info.address ?? ''}
                onChange={(e) => setInfo((p) => ({ ...p, address: e.target.value }))}
                className="mt-1"
                placeholder="Calle, número, distrito"
              />
            </div>

            <SaveButton
              saving={saving}
              saved={savedTab === 'info'}
              onClick={() => handleSave('info')}
            />
          </div>
        </TabsContent>

        {/* ── Tab: Contacto & Redes ── */}
        <TabsContent value="contact">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contact.phone ?? ''}
                  onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="9XX XXX XXX"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={contact.whatsapp ?? ''}
                  onChange={(e) => setContact((p) => ({ ...p, whatsapp: e.target.value }))}
                  placeholder="9XX XXX XXX"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={contact.email ?? ''}
                onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                className="mt-1"
                placeholder="albergue@ejemplo.com"
              />
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-3">Redes sociales</p>
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex items-center mt-1">
                    <span className="px-3 py-2 text-sm text-muted-foreground border border-r-0 border-border rounded-l-md bg-muted">@</span>
                    <Input
                      id="instagram"
                      value={contact.instagram ?? ''}
                      onChange={(e) => setContact((p) => ({ ...p, instagram: e.target.value }))}
                      placeholder="tuhandle"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={contact.facebook ?? ''}
                    onChange={(e) => setContact((p) => ({ ...p, facebook: e.target.value }))}
                    placeholder="nombre-de-pagina"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <div className="flex items-center mt-1">
                    <span className="px-3 py-2 text-sm text-muted-foreground border border-r-0 border-border rounded-l-md bg-muted">@</span>
                    <Input
                      id="tiktok"
                      value={contact.tiktok ?? ''}
                      onChange={(e) => setContact((p) => ({ ...p, tiktok: e.target.value }))}
                      placeholder="tuhandle"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <SaveButton
              saving={saving}
              saved={savedTab === 'contact'}
              onClick={() => handleSave('contact')}
            />
          </div>
        </TabsContent>

        {/* ── Tab: Galería ── */}
        <TabsContent value="gallery">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {photos.length}/12 fotos
              </p>
            </div>

            {/* Grid de fotos */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt="Foto del albergue"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Eliminar foto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Agregar foto */}
            {photos.length < 12 && (
              <div className="flex gap-2">
                <Input
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="URL de la foto (https://...)"
                  onKeyDown={(e) => e.key === 'Enter' && addPhoto()}
                />
                <Button variant="outline" size="sm" onClick={addPhoto} disabled={!newPhotoUrl.trim()}>
                  <Plus className="h-4 w-4" />
                  Agregar
                </Button>
              </div>
            )}

            {photos.length === 0 && (
              <div className="flex flex-col items-center py-10 gap-2 rounded-xl border border-dashed border-border text-center">
                <span className="text-3xl">📸</span>
                <p className="text-sm text-muted-foreground">Aún no hay fotos en la galería.</p>
              </div>
            )}

            <SaveButton
              saving={saving}
              saved={savedTab === 'gallery'}
              onClick={() => handleSave('gallery')}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SaveButton({
  saving,
  saved,
  onClick,
}: {
  saving: boolean
  saved: boolean
  onClick: () => void
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Button onClick={onClick} disabled={saving} size="sm">
        <Save className="h-4 w-4" />
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </Button>
      {saved && (
        <p className="text-sm text-green-600 dark:text-green-400">
          ¡Cambios guardados!
        </p>
      )}
    </div>
  )
}
