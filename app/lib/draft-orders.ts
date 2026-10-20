export type DraftOrderStatus = 'Open' | 'Invoice sent' | 'Completed';

export type DraftOrder = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  currency: string;
  status: DraftOrderStatus;
  itemCount: number;
};

export const DRAFT_ORDERS_STORAGE_KEY = 'serein-demo-draft-orders';

export const sampleDraftOrders: DraftOrder[] = [
  {
    id: 'D-1048',
    customer: 'Amelia Hart',
    email: 'amelia.hart@example.com',
    date: '2026-10-18T10:35:00.000Z',
    total: 248,
    currency: 'USD',
    status: 'Open',
    itemCount: 2,
  },
  {
    id: 'D-1047',
    customer: 'Noah Bennett',
    email: 'noah.bennett@example.com',
    date: '2026-10-17T15:20:00.000Z',
    total: 186,
    currency: 'USD',
    status: 'Invoice sent',
    itemCount: 1,
  },
  {
    id: 'D-1046',
    customer: 'Sofia Chen',
    email: 'sofia.chen@example.com',
    date: '2026-10-15T08:10:00.000Z',
    total: 324,
    currency: 'USD',
    status: 'Completed',
    itemCount: 3,
  },
  {
    id: 'D-1045',
    customer: 'Oliver James',
    email: 'oliver.james@example.com',
    date: '2026-10-12T12:00:00.000Z',
    total: 92,
    currency: 'USD',
    status: 'Open',
    itemCount: 1,
  },
];
