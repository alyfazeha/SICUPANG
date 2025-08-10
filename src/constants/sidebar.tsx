import { SidebarMenuItem } from "@/types/components";
import { ChartBar, ChartLine, Stethoscope, Thermometer } from "lucide-react";

const adminMenuItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dasbor",
    icon: <Thermometer className="mr-3 h-3 w-3" />,
    link: "/admin/dasbor",
  },
  {
    id: "analytics",
    label: "Analitik",
    icon: <ChartBar className="mr-3 h-3 w-3" />,
    subMenu: [
      {
        id: "kecamatan-analytics",
        label: "Kecamatan",
        icon: <ChartLine className="mr-3 h-3 w-3" />,
        link: "/admin/analitik/kecamatan",
      },
      {
        id: "analytics-pengguna",
        label: "Pengguna",
        icon: <Stethoscope className="mr-3 h-3 w-3" />,
        link: "/admin/analitik/pengguna",
      },
    ],
  },
];

const citizenMenuItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dasbor",
    icon: <Thermometer className="mr-3 h-3 w-3" />,
    link: "/masyarakat/dasbor",
  },
];

export { adminMenuItems, citizenMenuItems };