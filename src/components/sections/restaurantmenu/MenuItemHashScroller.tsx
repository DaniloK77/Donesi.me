"use client";

import { useEffect } from "react";
import {
  focusMenuItem,
  getMenuItemDomId,
} from "@/utils/menuItemNavigation";

export default function MenuItemHashScroller() {
  useEffect(() => {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    const prefix = `${getMenuItemDomId("")}`;

    if (!targetId.startsWith(prefix)) {
      return;
    }

    const itemId = targetId.slice(prefix.length);
    const frameId = window.requestAnimationFrame(() => {
      focusMenuItem(itemId);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return null;
}
