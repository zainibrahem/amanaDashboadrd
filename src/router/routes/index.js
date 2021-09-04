// ** Routes Imports
import AppRoutes from './Apps';
import FormRoutes from './Forms';
import PagesRoutes from './Pages';
import TablesRoutes from './Tables';
import ChartMapsRoutes from './ChartsMaps';
import DashboardRoutes from './Dashboards';
import UiElementRoutes from './UiElements';
import ExtensionsRoutes from './Extensions';
import PageLayoutsRoutes from './PageLayouts';

import CatalogRoutes from './Catalog';

import StockRoutes from './Stock';
import OrderRoutes from './Order';

import ShippingRoutes from './Shippings';

import UserRoutes from './Users';
import WalletRoutes from './Wallet';

import CouponRoutes from './Coupons';

import SupportDiskRoutes from './SupportDisk';

import SettingsRoutes from './Settings';
// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template';

// ** Default Route
const DefaultRoute = '/admin';

// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  ...CatalogRoutes,
  ...StockRoutes,
  ...AppRoutes,
  ...PagesRoutes,
  ...UiElementRoutes,
  ...ExtensionsRoutes,
  ...PageLayoutsRoutes,
  ...FormRoutes,
  ...TablesRoutes,
  ...ChartMapsRoutes,
  ...OrderRoutes,
  ...ShippingRoutes,
  ...UserRoutes,
  ...CouponRoutes,
  ...SupportDiskRoutes,
  ...SettingsRoutes,
  ...WalletRoutes
];

export { DefaultRoute, TemplateTitle, Routes };
