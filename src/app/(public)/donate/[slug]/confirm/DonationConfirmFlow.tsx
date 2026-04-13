'use client'

import { useState, useRef } from 'react'
import { CheckCircle2, Upload, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, formatPEN } from '@/lib/utils'

// ─── Tipos y constantes ───────────────────────────────────────────────────────

type PaymentMethod = 'yape' | 'bank'

const PRESET_AMOUNTS = [10, 20, 50, 100, 200]

interface DonationConfirmFlowProps {
  campaignSlug: string
  campaignTitle: string
  shelterName: string
  yapeNumber: string | null
  bankAccount: string | null
  bankName: string | null
  accountHolder: string | null
}

// ─── Indicador de pasos ───────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={cn(
              'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
              i < current
                ? 'bg-primary text-primary-foreground'
                : i === current
                ? 'bg-primary/20 text-primary border-2 border-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={cn('h-0.5 w-8 rounded', i < current ? 'bg-primary' : 'bg-muted')} />
          )}
        </div>
      ))}
      <span className="ml-2 text-xs text-muted-foreground">
        Paso {current + 1} de {total}
      </span>
    </div>
  )
}

// ─── Componente de copiar al portapapeles ─────────────────────────────────────

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-4 py-3">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-sm font-semibold text-foreground mt-0.5">{value}</p>
      </div>
      <button
        onClick={copy}
        className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        aria-label={`Copiar ${label}`}
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  )
}

// ─── Flujo principal ──────────────────────────────────────────────────────────

export default function DonationConfirmFlow({
  campaignSlug,
  campaignTitle,
  shelterName,
  yapeNumber,
  bankAccount,
  bankName,
  accountHolder,
}: DonationConfirmFlowProps) {
  const [step, setStep] = useState(0)
  const [amount, setAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [anonymous, setAnonymous] = useState(false)
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const finalAmount = amount ?? (customAmount ? Number(customAmount) : null)
  const hasYape = !!yapeNumber
  const hasBank = !!(bankAccount && bankName)

  // ── PASO 0: Elegir monto ──────────────────────────────────────────────────

  const renderStep0 = () => (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">¿Cuánto quieres donar?</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              onClick={() => { setAmount(preset); setCustomAmount('') }}
              className={cn(
                'rounded-xl border-2 py-3 text-sm font-bold transition-colors',
                amount === preset && !customAmount
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              S/{preset}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <Label htmlFor="custom-amount">O ingresa un monto personalizado</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              S/
            </span>
            <Input
              id="custom-amount"
              type="number"
              inputMode="numeric"
              min="1"
              placeholder="Otro monto"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setAmount(null) }}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="donation-message">Mensaje (opcional)</Label>
        <Input
          id="donation-message"
          placeholder="Ej: Fuerza Zeus, te apoyamos 🐾"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={200}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="accent-primary"
        />
        Donar de forma anónima
      </label>

      <Button
        size="lg"
        onClick={() => setStep(1)}
        disabled={!finalAmount || finalAmount < 1}
      >
        Continuar con {finalAmount ? formatPEN(finalAmount) : '—'}
      </Button>
    </div>
  )

  // ── PASO 1: Elegir método de pago ─────────────────────────────────────────

  const renderStep1 = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-foreground">¿Cómo vas a pagar?</h2>

      <div className="flex flex-col gap-3">
        {hasYape && (
          <button
            onClick={() => setMethod('yape')}
            className={cn(
              'flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors',
              method === 'yape'
                ? 'border-primary bg-accent/40'
                : 'border-border hover:border-primary/40'
            )}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#742483] text-white text-lg font-extrabold">
              Y
            </span>
            <div>
              <p className="font-semibold text-foreground">Yape</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Transferencia inmediata al número del albergue
              </p>
            </div>
          </button>
        )}

        {hasBank && (
          <button
            onClick={() => setMethod('bank')}
            className={cn(
              'flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors',
              method === 'bank'
                ? 'border-primary bg-accent/40'
                : 'border-border hover:border-primary/40'
            )}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-lg font-extrabold">
              B
            </span>
            <div>
              <p className="font-semibold text-foreground">Transferencia bancaria</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {bankName} · CCI del albergue
              </p>
            </div>
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
          Atrás
        </Button>
        <Button onClick={() => setStep(2)} disabled={!method} className="flex-1">
          Ver datos de pago
        </Button>
      </div>
    </div>
  )

  // ── PASO 2: Datos de pago ─────────────────────────────────────────────────

  const renderStep2 = () => (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Datos para tu transferencia</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Transfiere exactamente{' '}
          <strong className="text-foreground">{formatPEN(finalAmount!)}</strong> a:
        </p>
      </div>

      <div className="rounded-xl border border-border p-5 flex flex-col gap-3">
        {method === 'yape' && yapeNumber && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[#742483] text-white text-xs font-bold">Y</span>
              <span className="text-sm font-semibold text-foreground">Yape</span>
            </div>
            <CopyField label="Número Yape" value={yapeNumber} />
            <CopyField label="Titular" value={shelterName} />
            <CopyField label="Monto exacto" value={`S/ ${finalAmount}`} />
          </>
        )}

        {method === 'bank' && bankAccount && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">B</span>
              <span className="text-sm font-semibold text-foreground">{bankName}</span>
            </div>
            <CopyField label="CCI" value={bankAccount} />
            <CopyField label="Titular" value={accountHolder ?? shelterName} />
            <CopyField label="Monto exacto" value={`S/ ${finalAmount}`} />
          </>
        )}
      </div>

      <div className="rounded-lg bg-accent/60 border border-primary/20 px-4 py-3 text-sm text-accent-foreground">
        <strong>Importante:</strong> Después de realizar la transferencia, vuelve aquí y
        sube la captura del comprobante. El albergue lo verificará en 24–48 horas.
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
          Atrás
        </Button>
        <Button onClick={() => setStep(3)} className="flex-1">
          Ya transferí, subir comprobante
        </Button>
      </div>
    </div>
  )

  // ── PASO 3: Subir comprobante ─────────────────────────────────────────────

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Fase mock — cuando conectemos Supabase:
    // 1. Subir receiptFile a Supabase Storage → obtener URL
    // 2. Insertar en donations con receipt_url y payment_status='pending'
    await new Promise((r) => setTimeout(r, 1000))
    console.log('Donación enviada (mock):', {
      campaignSlug,
      amount: finalAmount,
      method,
      anonymous,
      message,
      receiptFile: receiptFile?.name,
    })
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const renderStep3 = () => (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Sube el comprobante</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Foto o captura de pantalla de la transferencia realizada.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors',
          receiptFile
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/40 hover:bg-muted/30'
        )}
      >
        {receiptFile ? (
          <>
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="text-sm font-medium text-foreground">{receiptFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(receiptFile.size / 1024).toFixed(0)} KB · Toca para cambiar
            </p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Toca para seleccionar imagen</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — máx 5 MB</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* Resumen */}
      <div className="rounded-xl border border-border px-5 py-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Monto</span>
          <span className="font-semibold text-foreground">{formatPEN(finalAmount!)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Método</span>
          <span className="font-medium text-foreground capitalize">{method === 'yape' ? 'Yape' : 'Banco'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Campaña</span>
          <span className="font-medium text-foreground text-right max-w-[60%] truncate">{campaignTitle}</span>
        </div>
        {anonymous && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Donante</span>
            <span className="text-muted-foreground italic">Anónimo</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
          Atrás
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!receiptFile || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar comprobante'}
        </Button>
      </div>
    </div>
  )

  // ── ÉXITO ─────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary" />
        <h2 className="text-xl font-bold text-foreground">¡Donación registrada!</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {shelterName} verificará tu comprobante en las próximas 24–48 horas y
          confirmará tu aporte. La barra de progreso se actualizará automáticamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a
            href="/donate"
            className="text-sm text-primary hover:underline"
          >
            Ver otras campañas →
          </a>
        </div>
      </div>
    )
  }

  // ── Render por paso ───────────────────────────────────────────────────────

  const STEPS = [renderStep0, renderStep1, renderStep2, renderStep3]
  const STEP_LABELS = ['Monto', 'Método', 'Transferir', 'Comprobante']

  return (
    <div>
      <StepIndicator current={step} total={STEPS.length} />
      <div className="text-xs text-muted-foreground mb-6 font-medium uppercase tracking-wide">
        {STEP_LABELS[step]}
      </div>
      {STEPS[step]()}
    </div>
  )
}
