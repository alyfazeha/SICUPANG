import { ChartBar, FolderKanban, IceCreamBowl, LayoutDashboard, Map, PlusCircle, Users } from "lucide-react";
import { FaUserGroup } from "react-icons/fa6";
import { FaUserShield } from "react-icons/fa";
import type { SidebarItem } from "@/types/components";
import type { Roles } from "@/types/auth";
import { ADMIN_ADD_SURVEYORS, ADMIN_DASHBOARD, ADMIN_FOOD_RECORD, ADMIN_MANAGE_SURVEYORS, ADMIN_PPH_RECORD, ADMIN_SUBDISTRICT_RECORD, SURVEYOR_ADD_DATA_FAMILY, SURVEYOR_DASHBOARD, SURVEYOR_FAMILY } from "@/constants/routes";

const SidebarMenus: Record<Roles, SidebarItem[]> = {
  ADMIN: [
    {
      href: ADMIN_DASHBOARD,
      icon: <FaUserShield className="h-4 w-4" />,
      label: "Dasbor",
    },
    {
      href: ADMIN_SUBDISTRICT_RECORD,
      icon: <Map className="h-4 w-4" />,
      label: "Rekap Kecamatan",
    },
    {
      href: ADMIN_FOOD_RECORD,
      icon: <IceCreamBowl className="h-4 w-4" />,
      label: "Rekap Pangan",
    },
    {
      href: ADMIN_PPH_RECORD,
      icon: <ChartBar className="h-4 w-4" />,
      label: "Rekap PPH",
    },
    {
      icon: <FaUserGroup className="h-4 w-4" />,
      label: "Surveyor",
      subMenu: [
        {
          href: ADMIN_MANAGE_SURVEYORS,
          icon: <FolderKanban className="h-4 w-4" />,
          label: "Kelola",
        },
        {
          href: ADMIN_ADD_SURVEYORS,
          icon: <PlusCircle className="h-4 w-4" />,
          label: "Tambah",
        },
      ],
    },
  ],
  SURVEYOR: [
    {
      href: SURVEYOR_DASHBOARD,
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dasbor",
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Keluarga",
      subMenu: [
        {
          href: SURVEYOR_FAMILY,
          icon: <FolderKanban className="h-4 w-4" />,
          label: "Kelola Data",
        },
        {
          href: SURVEYOR_ADD_DATA_FAMILY,
          icon: <PlusCircle className="h-4 w-4" />,
          label: "Tambah Data",
        },
      ],
    },
  ],
};

export { SidebarMenus };