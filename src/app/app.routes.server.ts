
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'category/:categoryId',
    renderMode: RenderMode.Client
  },
  {
    path: 'product/:categoryId/:productId',
    renderMode: RenderMode.Server
  },
  {
    path: 'order-success/:orderId',
    renderMode: RenderMode.Server
  },
  {
    path: 'payment-result',
    renderMode: RenderMode.Client
  },
  {
    path: 'orders',
    renderMode: RenderMode.Server
  },
  {
    path: 'orders/:orderId',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
