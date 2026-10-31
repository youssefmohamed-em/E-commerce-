import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path:'login',
    loadComponent: ()=>
      import('./components/login/login.component')
    .then( (m)=>m.LoginComponent )
  },
{
  path:'signup',
  loadComponent: () =>
    import('./components/signup/signup.component')
      .then((m) => m.SignupComponent)
},
  {
    path: '',
    component: LayoutComponent,
    children: [

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home.component')
            .then((m) => m.HomeComponent)
      },

      {
        path: 'categories',
        loadComponent: () =>
          import('./components/categories/categories.component')
            .then((m) => m.CategoriesComponent)
      },
      {
        path:'shop',
        loadComponent:()=>
          import('./components/shop/shop.component')
        .then( (m)=>m.ShopComponent)
      },

      {
        path: 'category/:categoryId',
        loadComponent: () =>
          import('./components/category-products/category-products.component')
            .then((m) => m.CategoryProductsComponent)
      },

      {
        path: 'product/:categoryId/:productId',
        loadComponent: () =>
          import('./components/product-details/product-details.component')
            .then((m) => m.ProductDetailsComponent)
      },

      {
        path: 'cart',
        loadComponent: () =>
          import('./components/cart/cart.component')
            .then((m) => m.CartComponent)
      },

      {
        path: 'offers',
        loadComponent: () =>
          import('./components/offers/offers.component')
            .then((m) => m.OffersComponent)
      },
      {
        path:'profile',
        loadComponent:()=>
          import('./components/profile/profile.component')
        .then( (m)=>m.ProfileComponent )
      },
      {
        path:'checkout',
        loadComponent:()=>
          import('./components/checkout/checkout.component')
        .then( (m)=>m.CheckoutComponent )
      },
      {
        path: 'payment-result',
        loadComponent: () =>
          import('./components/payment-result/payment-result.component')
            .then((m) => m.PaymentResultComponent)
      },
      {
        path:'about',
        loadComponent:()=>
          import('./components/about/about.component')
        .then((m)=> m.AboutComponent )
      },

      {
        path:'order-success/:orderId',
        loadComponent:()=>
          import ('./components/order-success/order-success.component')
        .then( (m)=> m.OrderSuccessComponent )
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/orders/orders.component')
            .then((m) => m.OrdersComponent)
      },
    {
  path: 'orders/:orderId',
  loadComponent: () =>
    import('./components/order-details/order-details.component')
      .then((m) => m.OrderDetailsComponent)
},
{
  path:"contact",
  loadComponent:()=>
    import('./components/contact/contact.component')
  .then((m)=>m.ContactComponent  )
}

    ]
  },

  {
    path: '**',
    redirectTo: 'home'
  }

];
