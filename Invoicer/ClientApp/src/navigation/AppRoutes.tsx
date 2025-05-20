import { Invoices } from "../pages/invoices";
import CreateOrUpdateInvoice from "../pages/createOrUpdateInvoice";
import ViewInvoice from "../pages/viewInvoice";

const AppRoutes = [
  {
    index: true,
    path: '/invoices',
    element: <Invoices />,
    name: "Invoices",
  },
  {
    path: '/invoices/create',
    element: <CreateOrUpdateInvoice />,
    name: "Create Invoice",
  },
  {
    path: '/invoices/create/:id',
    element: <CreateOrUpdateInvoice />,
    name: "Modify Invoice",
    hide: true,
  },
  {
    path: '/invoices/:id',
    element: <ViewInvoice />,
    name: "View Invoice",
    hide: true,
  }
];

export default AppRoutes;
