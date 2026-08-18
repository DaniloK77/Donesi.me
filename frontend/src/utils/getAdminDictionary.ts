import "server-only";

import type { Lang } from "./getDictionary";

export type AdminDictionary = {
  title: string;
  description: string;
  loadingLabel: string;
  genericErrorLabel: string;
  retryLabel: string;
  forbiddenTitle: string;
  forbiddenMessage: string;
  backHomeLabel: string;
  tabs: {
    orders: string;
    restaurants: string;
    people: string;
  };
  overview: {
    totalOrders: string;
    activeOrders: string;
    restaurants: string;
    users: string;
    couriers: string;
  };
  statusLabels: {
    PENDING: string;
    CONFIRMED: string;
    PREPARING: string;
    OUT_FOR_DELIVERY: string;
    DELIVERED: string;
    CANCELLED: string;
  };
  orders: {
    emptyTitle: string;
    emptyMessage: string;
    filterAll: string;
    orderLabel: string;
    customerLabel: string;
    restaurantLabel: string;
    statusLabel: string;
    courierLabel: string;
    totalLabel: string;
    placedOnLabel: string;
    itemsLabel: string;
    noCourierLabel: string;
    unassignCourierLabel: string;
    acceptLabel: string;
    rejectLabel: string;
    advanceLabel: string;
    markDeliveredLabel: string;
    deleteLabel: string;
    deleteConfirmLabel: string;
    simulateLabel: string;
    hideSimulationLabel: string;
    simulationHint: string;
    pickupOrderLabel: string;
    updatingLabel: string;
    estimateLabel: string;
    minutesShort: string;
    paymentLabel: string;
    cancelledByLabel: {
      CUSTOMER: string;
      ADMIN: string;
      RESTAURANT: string;
    };
  };
  restaurants: {
    emptyMessage: string;
    menuItemsLabel: string;
    showMenuLabel: string;
    hideMenuLabel: string;
    availableLabel: string;
    unavailableLabel: string;
    deliveryTimeLabel: string;
    minutesShort: string;
    editMenuLabel: string;
    doneEditingLabel: string;
    addCategoryLabel: string;
    categoryNamePlaceholder: string;
    deleteCategoryLabel: string;
    deleteCategoryConfirm: string;
    addItemLabel: string;
    itemNamePlaceholder: string;
    itemPricePlaceholder: string;
    itemDescriptionPlaceholder: string;
    itemImagePlaceholder: string;
    uploadImageLabel: string;
    uploadingLabel: string;
    orPasteLinkLabel: string;
    uploadFailed: string;
    imageTooLarge: string;
    unsupportedImageType: string;
    removeImageLabel: string;
    imagePreviewLabel: string;
    imageInvalid: string;
    saveLabel: string;
    cancelLabel: string;
    editLabel: string;
    deleteItemLabel: string;
    deleteItemConfirm: string;
    markUnavailableLabel: string;
    markAvailableLabel: string;
    actionError: string;
  };
  people: {
    usersTitle: string;
    couriersTitle: string;
    emptyUsers: string;
    emptyCouriers: string;
    orderCountLabel: string;
    activeDeliveriesLabel: string;
    inactiveLabel: string;
    deleteUserLabel: string;
    deleteUserConfirm: string;
    deleteCourierLabel: string;
    deleteCourierConfirm: string;
    activateLabel: string;
    deactivateLabel: string;
    cannotDeleteSelf: string;
    lastAdmin: string;
    courierOnDelivery: string;
    actionError: string;
    roleLabels: {
      CUSTOMER: string;
      ADMIN: string;
      RESTAURANT_OWNER: string;
      COURIER: string;
    };
    vehicleLabels: {
      SCOOTER: string;
      BICYCLE: string;
      CAR: string;
    };
  };
};

const dictionaries: Record<Lang, () => Promise<AdminDictionary>> = {
  en: () =>
    import("@/data/pagesTextData/en/admin-page.json").then(
      (module) => module.default as AdminDictionary,
    ),
  me: () =>
    import("@/data/pagesTextData/me/admin-page.json").then(
      (module) => module.default as AdminDictionary,
    ),
};

export async function getAdminDictionary(lang: Lang) {
  return dictionaries[lang]();
}
