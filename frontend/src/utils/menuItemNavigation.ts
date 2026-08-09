export const getMenuItemDomId = (itemId: string) =>
  `menu-item-${itemId}`;

export const getMenuItemHash = (itemId: string) =>
  `#${getMenuItemDomId(itemId)}`;

export function focusMenuItem(itemId: string) {
  const menuItem = document.getElementById(getMenuItemDomId(itemId));

  if (!menuItem) {
    return false;
  }

  menuItem.scrollIntoView({ behavior: "smooth", block: "center" });
  menuItem.dataset.highlighted = "true";

  window.setTimeout(() => {
    delete menuItem.dataset.highlighted;
  }, 1800);

  return true;
}
