import { DEMO_MODE } from '../../data/restaurant';
import { localGateway } from './localGateway';
import { createHttpGateway } from './httpGateway';
import type { OrderGateway } from './gateway';

const apiUrl = import.meta.env.VITE_ORDERS_API_URL as string | undefined;

/** Passerelle active : démo locale tant que DEMO_MODE est actif ou qu'aucune API n'est configurée. */
export const orders: OrderGateway = !DEMO_MODE && apiUrl ? createHttpGateway(apiUrl) : localGateway;

export * from './gateway';
