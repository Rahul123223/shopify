import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import type {Route} from './+types/draft-orders.new';
import {DRAFT_ORDERS_STORAGE_KEY, type DraftOrder} from '~/lib/draft-orders';

type DraftForm = {
  customerName: string;
  email: string;
  company: string;
  address: string;
  city: string;
  postalCode: string;
  product: string;
  quantity: number;
  unitPrice: number;
  note: string;
  paymentDue: string;
};

const initialForm: DraftForm = {
  customerName: '',
  email: '',
  company: '',
  address: '',
  city: '',
  postalCode: '',
  product: 'Linen throw — Natural',
  quantity: 1,
  unitPrice: 128,
  note: '',
  paymentDue: 'Due on receipt',
};

const steps = [
  {label: 'Customer', detail: 'Who is this for?'},
  {label: 'Items', detail: 'What are they ordering?'},
  {label: 'Payment', detail: 'Set payment terms'},
  {label: 'Review', detail: 'Check the details'},
];

export const meta: Route.MetaFunction = () => [
  {title: 'New draft order | Serein Studio'},
];

export default function NewDraftOrderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<DraftForm>(initialForm);
  const [error, setError] = useState('');

  function update<K extends keyof DraftForm>(key: K, value: DraftForm[K]) {
    setForm((current) => ({...current, [key]: value}));
  }

  function continueStep() {
    setError('');
    if (step === 0) {
      if (!form.customerName.trim()) return setError('Add a customer name to continue.');
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        return setError('Enter a valid customer email address.');
      }
    }
    if (step === 1 && (!form.product.trim() || form.quantity < 1 || form.unitPrice < 0)) {
      return setError('Add a product and enter a valid quantity and price.');
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function createDraft() {
    const draft: DraftOrder = {
      id: `D-${Date.now().toString().slice(-5)}`,
      customer: form.customerName.trim(),
      email: form.email.trim(),
      date: new Date().toISOString(),
      total: form.quantity * form.unitPrice,
      currency: 'USD',
      status: 'Open',
      itemCount: form.quantity,
    };

    try {
      const stored = window.localStorage.getItem(DRAFT_ORDERS_STORAGE_KEY);
      const existing = stored ? (JSON.parse(stored) as DraftOrder[]) : [];
      window.localStorage.setItem(
        DRAFT_ORDERS_STORAGE_KEY,
        JSON.stringify([draft, ...existing]),
      );
      navigate('/draft-orders');
    } catch {
      setError('This browser could not save the draft. Check storage settings and try again.');
    }
  }

  const subtotal = form.quantity * form.unitPrice;

  return (
    <section className="draft-page draft-create-page" aria-labelledby="new-draft-heading">
      <div className="draft-page-topline">
        <p className="draft-breadcrumb"><Link to="/draft-orders">Draft orders</Link> <span>/</span> New draft</p>
        <span className="draft-demo-chip"><span /> Demo data</span>
      </div>

      <div className="draft-page-heading draft-create-heading">
        <div>
          <p className="draft-eyebrow">Order management</p>
          <h1 id="new-draft-heading">Create draft order</h1>
          <p className="draft-page-description">Build an order for a customer, then review it before saving.</p>
        </div>
        <Link className="draft-back-link" to="/draft-orders">← Back to draft orders</Link>
      </div>

      <div className="draft-stepper" aria-label="Draft order steps">
        {steps.map((item, index) => (
          <div className={`draft-step ${index === step ? 'is-active' : ''} ${index < step ? 'is-complete' : ''}`} key={item.label}>
            <div className="draft-step-marker">{index < step ? '✓' : String(index + 1).padStart(2, '0')}</div>
            <div className="draft-step-copy"><strong>{item.label}</strong><span>{item.detail}</span></div>
          </div>
        ))}
      </div>

      <div className="draft-builder-layout">
        <div className="draft-form-card">
          <div className="draft-form-heading">
            <span>Step {step + 1} of {steps.length}</span>
            <h2>{steps[step].label}</h2>
            <p>{steps[step].detail}</p>
          </div>

          {step === 0 && (
            <div className="draft-form-fields">
              <label className="draft-field draft-field-full">Customer name <span>*</span><input autoComplete="name" onChange={(event) => update('customerName', event.currentTarget.value)} placeholder="e.g. Amelia Hart" value={form.customerName} /></label>
              <label className="draft-field draft-field-full">Email address <span>*</span><input autoComplete="email" onChange={(event) => update('email', event.currentTarget.value)} placeholder="name@example.com" type="email" value={form.email} /></label>
              <label className="draft-field draft-field-full">Company <span className="draft-optional">Optional</span><input autoComplete="organization" onChange={(event) => update('company', event.currentTarget.value)} placeholder="Company name" value={form.company} /></label>
              <div className="draft-address-divider"><span>Shipping address</span><span>Optional</span></div>
              <label className="draft-field draft-field-full">Street address<input autoComplete="street-address" onChange={(event) => update('address', event.currentTarget.value)} placeholder="Street and number" value={form.address} /></label>
              <label className="draft-field">City<input autoComplete="address-level2" onChange={(event) => update('city', event.currentTarget.value)} placeholder="City" value={form.city} /></label>
              <label className="draft-field">Postal code<input autoComplete="postal-code" onChange={(event) => update('postalCode', event.currentTarget.value)} placeholder="Postal code" value={form.postalCode} /></label>
            </div>
          )}

          {step === 1 && (
            <div className="draft-form-fields">
              <label className="draft-field draft-field-full">Product or custom item<input onChange={(event) => update('product', event.currentTarget.value)} placeholder="Search products or enter a custom item" value={form.product} /></label>
              <div className="draft-item-editor">
                <div className="draft-item-art" aria-hidden="true">L</div>
                <div className="draft-item-description"><strong>{form.product || 'New item'}</strong><span>Custom line item · Demo catalog</span></div>
                <label className="draft-field draft-quantity-field">Qty<input min="1" onChange={(event) => update('quantity', Number(event.currentTarget.value))} type="number" value={form.quantity} /></label>
                <label className="draft-field draft-price-field">Price<input min="0" onChange={(event) => update('unitPrice', Number(event.currentTarget.value))} step="0.01" type="number" value={form.unitPrice} /></label>
              </div>
              <p className="draft-inline-hint">Prices are shown in USD. Product selection is a demo field.</p>
            </div>
          )}

          {step === 2 && (
            <div className="draft-form-fields">
              <label className="draft-field draft-field-full">Payment due<select onChange={(event) => update('paymentDue', event.currentTarget.value)} value={form.paymentDue}><option>Due on receipt</option><option>Due in 7 days</option><option>Due in 15 days</option><option>Due in 30 days</option></select></label>
              <label className="draft-field draft-field-full">Order note <span className="draft-optional">Optional</span><textarea onChange={(event) => update('note', event.currentTarget.value)} placeholder="Add a note for your team" rows={4} value={form.note} /></label>
              <div className="draft-payment-info"><span aria-hidden="true">i</span><p>The customer will be able to pay when an invoice is sent. No payment is collected while saving this draft.</p></div>
            </div>
          )}

          {step === 3 && (
            <div className="draft-review">
              <div className="draft-review-section"><div className="draft-review-title"><h3>Customer</h3><button onClick={() => setStep(0)} type="button">Edit</button></div><strong>{form.customerName}</strong><span>{form.email}</span>{form.company && <span>{form.company}</span>}{form.address && <span>{form.address}{form.city ? `, ${form.city}` : ''} {form.postalCode}</span>}</div>
              <div className="draft-review-section"><div className="draft-review-title"><h3>Items</h3><button onClick={() => setStep(1)} type="button">Edit</button></div><div className="draft-review-line"><div className="draft-item-art" aria-hidden="true">L</div><span>{form.product}<small>Qty {form.quantity} × {formatMoney(form.unitPrice)}</small></span><strong>{formatMoney(subtotal)}</strong></div></div>
              <div className="draft-review-section"><div className="draft-review-title"><h3>Payment</h3><button onClick={() => setStep(2)} type="button">Edit</button></div><span>{form.paymentDue}</span>{form.note && <p className="draft-review-note">{form.note}</p>}</div>
              <div className="draft-review-total"><span>Estimated total</span><strong>{formatMoney(subtotal)}</strong></div>
            </div>
          )}

          {error && <p className="draft-form-error" role="alert">{error}</p>}

          <div className="draft-form-actions">
            {step > 0 ? <button className="draft-secondary-button" onClick={() => {setError(''); setStep((current) => current - 1);}} type="button">← Back</button> : <Link className="draft-secondary-button" to="/draft-orders">Cancel</Link>}
            {step < steps.length - 1 ? <button className="draft-primary-button" onClick={continueStep} type="button">Continue <span aria-hidden="true">→</span></button> : <button className="draft-primary-button" onClick={createDraft} type="button">Save draft order <span aria-hidden="true">✓</span></button>}
          </div>
        </div>

        <aside className="draft-order-preview" aria-label="Order summary">
          <p className="draft-eyebrow">Order summary</p>
          <h2>{form.customerName || 'New customer'}</h2>
          <span className="draft-preview-email">{form.email || 'Customer details appear here'}</span>
          <div className="draft-preview-rule" />
          <div className="draft-preview-item"><span>{form.product || 'No item selected'}<small>Qty {form.quantity}</small></span><strong>{formatMoney(subtotal)}</strong></div>
          <div className="draft-preview-rule" />
          <div className="draft-preview-total"><span>Estimated total</span><strong>{formatMoney(subtotal)}</strong></div>
          <div className="draft-preview-caption"><span aria-hidden="true">✳</span><p>You'll review all details before saving this draft.</p></div>
        </aside>
      </div>
      <p className="draft-data-note">This demo saves draft orders in this browser only. Connect Shopify Admin API to create live draft orders.</p>
    </section>
  );
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}
