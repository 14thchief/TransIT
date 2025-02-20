import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import RouteWrapper from "./RouteWrapper";
import Businesses from "src/pages/Admin/Businesses";
import Business from "src/pages/Admin/Businesses/Business";
import Transactions from "src/pages/Admin/Transactions";
import PaymentProcessors from "src/pages/Admin/PaymentProcessors";
import PaymentProcessor from "src/pages/Admin/PaymentProcessors/PaymentProcessor";
import Settlements from "src/pages/Admin/Settlements";
import Reconciliation from "src/pages/Admin/Reconciliation";
import SettlementsPayout from "src/pages/Admin/Settlements/SettlementsPayout";
import SettingsLayout from "src/layout/AdminLayout/SettingsLayout";
import FeesManagement from "src/pages/Admin/Settings/FeesManagement";
import SettlementsBatch from "src/pages/Admin/SettlementsBatch";
import ReconciliationBatch from "src/pages/Admin/ReconciliationBatch";
import RolesManagement from "src/pages/Admin/Settings/RolesManagement";
import UserManagement from "src/pages/Admin/Settings/UserManagement";
import PermissionProtectedRoute from "components/Global/PermissionPageWrapper";
import { useAllModulePermissions } from "src/hooks/useSessionUserRole";
import BankAccounts from "src/pages/Admin/BankAccounts";
import Payouts from "src/pages/Admin/Payouts";
import PayoutTransactions from "src/pages/Admin/Payouts/PayoutTransactions";

const AdminRoutes = () => {
  const {
    // paymentMethodModulePermissions,
    paymentProcessorModulePermissions,
    rolePermissionModulePermissions,
    // convenienceFeeManagementModulePermissions,
    businessModulePermissions,
    transactionsModulePermissions,
    gatewayModulePermissions,
    settlementModulePermissions,
    reconciliationModulePermissions,
    userManagementModulePermissions,
    globalFeeManagementModulePermissions,
  } = useAllModulePermissions();

  return (
    <Routes>
      <Route index element={<Navigate to="businesses" replace />} />
      <Route
        element={
          <RouteWrapper>
            <Outlet />
          </RouteWrapper>
        }
      >
        <Route
          path="businesses"
          element={
            <PermissionProtectedRoute
              requiredPermissions={businessModulePermissions}
              fallbackRoute="/admin/transactions"
            />
          }
        >
          <Route path="" element={<Businesses />} />
          <Route path=":id" element={<Business />} />
        </Route>
      </Route>
    </Routes>
  );
};
export default AdminRoutes;
