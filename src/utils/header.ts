import { SidebarMenus } from "@/constants/sidebar";
import type { Roles } from "@/types/auth";
import type { SidebarItem } from "@/types/components";

/**
 * Flatten nested sidebar menus into a single array.
 *
 * @param menus - The nested sidebar menus.
 * @returns A single array of all sidebar menus.
 */
function flattenMenus(menus: SidebarItem[]): SidebarItem[] {
  return menus.flatMap((menu) => menu.subMenu ? [menu, ...flattenMenus(menu.subMenu)] : [menu]);
}

/**
 * Get the title of the current page based on the pathname and user role.
 *
 * @param pathname - The current pathname.
 * @param role - The user role.
 * @returns The title of the current page, or null if no match is found.
 */
export function setTitleHeader(pathname: string, role: Roles | null): string | null {
  if (!role) return null;
  const activeMenu = flattenMenus(SidebarMenus[role]).filter((menu) => menu.href && pathname.startsWith(menu.href)).sort((a, b) => (b.href as string).length - (a.href as string).length)[0];
  return activeMenu ? activeMenu.label : null;
}