// ** Navigation sections imports
import apps from './apps';
import pages from './pages';
import forms from './forms';
import tables from './tables';
import others from './others';
import dashboards from './dashboards';
import uiElements from './ui-elements';
import chartsAndMaps from './charts-maps';
import catalog from './catalog';

import Stock from './stock';

import Order from './order';

import Shipping from './shipping';

import UsersM from './usersM';

import Coupones from './cuopones';

import SupportDisk from './supportDisk';

import Settings from './settings';
import './style.css';
// ** Merge & Export
export default [
  ...dashboards,
  ...catalog,
  ...Stock,
  ...Order,
  ...Shipping,
  ...UsersM,
  ...Coupones,
  ...SupportDisk,
  ...Settings,
  // ...apps,
  // ...pages,
  // ...uiElements,
  // ...forms,
  // ...tables,
  // ...chartsAndMaps,
  // ...others,
];
