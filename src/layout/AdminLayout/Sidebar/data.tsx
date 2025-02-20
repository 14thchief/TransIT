import { BiTransferAlt } from "react-icons/bi";
import { BsBank } from "react-icons/bs";
import { GrFlows } from "react-icons/gr";
import { IoCogSharp } from "react-icons/io5";
import { LuArrowUpDown } from "react-icons/lu";
import { MdOutlineCompareArrows } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";
import { RiSecurePaymentLine } from "react-icons/ri";

export const sidebarData = {
  topRoutes: [
    {
      title: "Businesses",
      icon: <PiBuildingOffice size={24} />,
      path: "/admin/businesses",
      access: "*",
      permissionName: "business",
    },
    {
      title: "Transactions",
      icon: <BiTransferAlt size={24} />,
      path: "/admin/transactions",
      access: "*",
      permissionName: "transaction",
    },
    {
      title: "Gateway Processors",
      icon: <GrFlows size={24} />,
      path: "/admin/processors",
      access: "*",
      permissionName: "payment-processor",
    },
    {
      title: "Bank Accounts",
      icon: <BsBank size={24} />,
      path: "/admin/bank_accounts",
      access: "*",
      permissionName: "",
    },
    {
      title: "Payouts",
      icon: <RiSecurePaymentLine size={24} />,
      path: "/admin/payouts",
      access: "*",
      permissionName: "",
    },
    {
      title: "Reconciliation",
      icon: <MdOutlineCompareArrows size={24} />,
      path: "/admin/reconciliation",
      access: "*",
      permissionName: "reconcilation",
    },
    {
      title: "Settlements",
      icon: <LuArrowUpDown size={22} />,
      path: "/admin/settlements",
      access: "*",
      permissionName: "settlement",
    },
    {
      title: "Settings",
      icon: <IoCogSharp size={24} />,
      path: "/admin/settings",
      access: "*",
      permissionName: "",
    },
  ],
  bottomRoutes: [],
};
