import { useState } from 'react';
import { Button, Checkbox, Tooltip } from 'pod-test-ui';
import { Wallet, CalendarDays, FileText, Info } from 'lucide-react';
import { Field } from './form/Field.js';
import { TextInput } from './form/TextInput.js';
import { Select } from './form/Select.js';

type Source = '' | 'salary' | 'freelance' | 'investment' | 'business' | 'gift' | 'other';

const sources: Array<{ value: Exclude<Source, ''>; label: string }> = [
  { value: 'salary',     label: 'Gaji / Salary' },
  { value: 'freelance',  label: 'Freelance / Project' },
  { value: 'investment', label: 'Investasi (dividen, bunga, capital gain)' },
  { value: 'business',   label: 'Usaha / Bisnis' },
  { value: 'gift',       label: 'Hadiah / Transfer' },
  { value: 'other',      label: 'Lainnya' },
];

const today = () => new Date().toISOString().slice(0, 10);

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

interface FormState {
  amount: string;
  source: Source;
  date: string;
  description: string;
  recurring: boolean | 'indeterminate';
  taxable: boolean | 'indeterminate';
}

const initial: FormState = {
  amount: '',
  source: '',
  date: today(),
  description: '',
  recurring: false,
  taxable: false,
};

export function AddIncomeForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedRef, setSavedRef] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const numericAmount = Number(form.amount.replace(/[^\d]/g, '')) || 0;

  const validate = (): typeof errors => {
    const e: typeof errors = {};
    if (!form.amount || numericAmount <= 0) e.amount = 'Masukkan jumlah lebih dari Rp 0.';
    if (!form.source) e.source = 'Pilih sumber pemasukan.';
    if (!form.date) e.date = 'Tanggal wajib diisi.';
    if (form.description.trim().length > 140) e.description = 'Deskripsi maks 140 karakter.';
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSavedRef(null);
    await new Promise((r) => setTimeout(r, 700)); // simulate POST
    const ref = `INC-${Date.now().toString().slice(-6)}`;
    setSubmitting(false);
    setSavedRef(ref);
    setForm(initial);
    setErrors({});
  };

  const onReset = () => {
    setForm(initial);
    setErrors({});
    setSavedRef(null);
  };

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
          Catat Pemasukan
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Form ini full token-driven dari <code className="text-text-secondary">pod-test-ui</code> + <code className="text-text-secondary">pod-test-tokens</code>.
          Komponen Button & Checkbox dari library; TextInput / Select / Field lokal (token-only) karena belum ada di library.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-5 rounded-xl border border-border-default bg-surface p-6 shadow-foundation-sm"
        noValidate
      >
        {/* Amount */}
        <Field
          label="Jumlah"
          required
          description="Masukkan dalam Rupiah. Pisahkan ribuan otomatis saat tampil."
          error={errors.amount}
        >
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              invalid={invalid}
              inputMode="numeric"
              autoComplete="off"
              placeholder="0"
              prefix={<span className="font-medium text-text-secondary">Rp</span>}
              suffix={
                form.amount && numericAmount > 0 ? (
                  <span className="text-text-muted text-xs tabular-nums">
                    {formatRupiah(numericAmount)}
                  </span>
                ) : undefined
              }
              value={form.amount}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^\d]/g, '');
                setField('amount', cleaned);
              }}
            />
          )}
        </Field>

        {/* Source */}
        <Field
          label="Sumber Pemasukan"
          required
          error={errors.source}
        >
          {({ id, describedBy, invalid }) => (
            <Select
              id={id}
              aria-describedby={describedBy}
              error={invalid ? errors.source : undefined}
              placeholder="Pilih sumber…"
              options={sources}
              value={form.source}
              onChange={(e) => setField('source', e.target.value as Source)}
            />
          )}
        </Field>

        {/* Date */}
        <Field
          label="Tanggal"
          required
          error={errors.date}
        >
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              invalid={invalid}
              type="date"
              prefix={<CalendarDays size={14} />}
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
            />
          )}
        </Field>

        {/* Description */}
        <Field
          label="Deskripsi"
          description="Opsional. Catatan singkat — gaji bulan apa, project apa, dll."
          error={errors.description}
        >
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              invalid={invalid}
              type="text"
              maxLength={140}
              prefix={<FileText size={14} />}
              placeholder="Gaji Mei 2026"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          )}
        </Field>

        {/* Toggles */}
        <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-canvas/40 p-4">
          <Checkbox
            checked={form.recurring}
            onCheckedChange={(c) => setField('recurring', c)}
            label="Pemasukan rutin bulanan"
            description="Centang kalau ini terjadi setiap bulan (gaji, dividen tetap, dll). Sistem akan otomatis ngingetin."
          />
          <Checkbox
            checked={form.taxable}
            onCheckedChange={(c) => setField('taxable', c)}
            label="Kena pajak (PPh)"
            description="Centang kalau pemasukan ini termasuk objek pajak. Akan dimasukkan kalkulasi laporan tahunan."
          />
        </div>

        {/* Footer actions */}
        <footer className="flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Tooltip content="Semua field wajib (*) harus diisi. Data tidak terkirim ke server — ini demo lokal." side="top">
              <button type="button" aria-label="Info form">
                <Info size={14} className="text-text-muted hover:text-text-secondary transition-colors" />
              </button>
            </Tooltip>
            <span>Data hanya dipakai di sesi ini.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={submitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
              leftIcon={<Wallet size={14} />}
            >
              Simpan Pemasukan
            </Button>
          </div>
        </footer>
      </form>

      {savedRef && (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 rounded-lg border border-success/40 bg-success-subtle p-4 text-sm"
        >
          <div className="shrink-0 mt-0.5">
            <Wallet size={16} className="text-success" />
          </div>
          <div className="flex-1 text-text-primary">
            <p className="font-medium">Pemasukan tercatat.</p>
            <p className="text-text-muted">
              Reference: <code className="text-text-secondary">{savedRef}</code>. Form sudah di-reset, siap input baru.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
