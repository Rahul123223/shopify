import {useEffect, useMemo, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/draft-orders._index';
import {
  DRAFT_ORDERS_STORAGE_KEY,
  sampleDraftOrders,
  type DraftOrder,
  type DraftOrderStatus,
} from '~/lib/draft-orders';

type StatusFilter = 'All' | DraftOrderStatus;

export const meta: Route.MetaFunction = () => [
  {title: 'Draft orders | Serein Studio'},
];

export async function loader() {
  return {draftOrders: sampleDraftOrders};
}

export default function DraftOrdersPage() {
  const {draftOrders: sampleOrders} = useLoaderData<typeof loader>();
  const [savedOrders, setSavedOrders] = useState<DraftOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DRAFT_ORDERS_STORAGE_KEY);
      if (stored) setSavedOrders(JSON.parse(stored) as DraftOrder[]);
    } catch {
      setSavedOrders([]);
    }
  }, []);

  const allOrders = useMemo(
    () => [...savedOrders, ...sampleOrders],
    [savedOrders, sampleOrders],
  );
  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allOrders.filter((order) => {
      const matchesSearch =
        !query ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);
      return (
        matchesSearch &&
        (statusFilter === 'All' || order.status === statusFilter)
      );
    });
  }, [allOrders, search, statusFilter]);

  const filters: StatusFilter[] = ['All', 'Open', 'Invoice sent', 'Completed'];

  return (
    <section className="draft-page" aria-labelledby="draft-orders-heading">
      <div className="draft-page-topline">
        <p className="draft-breadcrumb">Orders <span>/</span> Draft orders</p>
        <span className="draft-demo-chip"><span /> Demo data</span>
      </div>

      <div className="draft-page-heading">
        <div>
          <p className="draft-eyebrow">Order management</p>
          <h1 id="draft-orders-heading">Draft orders</h1>
          <p className="draft-page-description">
            Prepare an order for a customer and send it when everything is ready.
          </p>
        </div>
        <Link className="draft-primary-button" to="/draft-orders/new">
          <span aria-hidden="true">＋</span> New draft order
        </Link>
      </div>

      <div className="draft-summary-grid" aria-label="Draft order summary">
        <SummaryCard label="All drafts" value={allOrders.length.toString()} icon="▤" />
        <SummaryCard
          label="Open"
          value={allOrders.filter((order) => order.status === 'Open').length.toString()}
          icon="◷"
        />
        <SummaryCard
          label="Invoice sent"
          value={allOrders.filter((order) => order.status === 'Invoice sent').length.toString()}
          icon="↗"
        />
        <SummaryCard
          label="Completed"
          value={allOrders.filter((order) => order.status === 'Completed').length.toString()}
          icon="✓"
        />
      </div>

      <div className="draft-table-card">
        <div className="draft-table-toolbar">
          <div className="draft-filter-tabs" role="tablist" aria-label="Filter draft orders">
            {filters.map((filter) => (
              <button
                aria-selected={statusFilter === filter}
                className={statusFilter === filter ? 'is-selected' : ''}
                key={filter}
                onClick={() => setStatusFilter(filter)}
                role="tab"
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
          <label className="draft-search">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Search draft orders</span>
            <input
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search drafts"
              type="search"
              value={search}
            />
          </label>
        </div>

        {visibleOrders.length > 0 ? (
          <div className="draft-table-scroll">
            <table className="draft-table">
              <thead>
                <tr>
                  <th scope="col">Draft</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Date created</th>
                  <th scope="col">Items</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col"><span className="sr-only">Open draft</span></th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="draft-order-number">{order.id}</span></td>
                    <td>
                      <span className="draft-customer-name">{order.customer}</span>
                      <span className="draft-customer-email">{order.email}</span>
                    </td>
                    <td>{formatDate(order.date)}</td>
                    <td>{order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</td>
                    <td className="draft-total">{formatMoney(order.total, order.currency)}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td><button aria-label={`More actions for ${order.id}`} className="draft-more-button" type="button">···</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="draft-empty-state">
            <span className="draft-empty-icon" aria-hidden="true">▤</span>
            <h2>No draft orders found</h2>
            <p>Try a different search or status, or create a new draft order.</p>
            <Link className="draft-secondary-button" to="/draft-orders/new">Create a draft order</Link>
          </div>
        )}

        <div className="draft-table-footer">
          Showing <strong>{visibleOrders.length}</strong> of <strong>{allOrders.length}</strong> draft orders
        </div>
      </div>
      <p className="draft-data-note">Drafts created here are saved in this browser only. Connect Shopify Admin API to manage live orders.</p>
    </section>
  );
}

function SummaryCard({label, value, icon}: {label: string; value: string; icon: string}) {
  return (
    <div className="draft-summary-card">
      <span className="draft-summary-icon" aria-hidden="true">{icon}</span>
      <span className="draft-summary-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({status}: {status: DraftOrderStatus}) {
  const className = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`draft-status draft-status-${className}`}><span />{status}</span>;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
