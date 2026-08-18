"use client";

import { useState } from "react";
import { Bike, Car, Loader2, Phone, Power, Star, Trash2 } from "lucide-react";

import type { AdminDictionary } from "@/utils/getAdminDictionary";
import { useAuth } from "@/components/auth";
import {
  AdminApiError,
  deleteCourier as deleteCourierRequest,
  deleteUser as deleteUserRequest,
  updateCourier,
} from "./api";
import type { AdminUser, CourierVehicle, CourierWithLoad } from "./types";

const VEHICLE_ICONS: Record<CourierVehicle, typeof Bike> = {
  SCOOTER: Bike,
  BICYCLE: Bike,
  CAR: Car,
};

const ROLE_STYLES = {
  ADMIN: "bg-brand-ink text-white",
  RESTAURANT_OWNER: "bg-indigo-100 text-indigo-800",
  COURIER: "bg-brand/15 text-brand",
  CUSTOMER: "bg-brand-ink/8 text-brand-ink/60",
} as const;

const fill = (template: string, name: string) => template.replace("{name}", name);

export default function AdminPeopleTab({
  content,
  users,
  couriers,
  onUsersChange,
  onCouriersChange,
}: {
  content: AdminDictionary;
  users: AdminUser[] | null;
  couriers: CourierWithLoad[];
  onUsersChange: (users: AdminUser[]) => void;
  onCouriersChange: (couriers: CourierWithLoad[]) => void;
}) {
  const copy = content.people;
  const { user: signedInUser } = useAuth();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Maps the API's refusal codes onto the localized explanation. */
  const describeFailure = (failure: unknown) => {
    const code = failure instanceof AdminApiError ? failure.code : undefined;
    const messages: Record<string, string> = {
      CANNOT_DELETE_SELF: copy.cannotDeleteSelf,
      LAST_ADMIN: copy.lastAdmin,
      COURIER_ON_DELIVERY: copy.courierOnDelivery,
    };

    return (code && messages[code]) || copy.actionError;
  };

  const run = async (id: string, action: () => Promise<void>) => {
    setBusyId(id);
    setError(null);

    try {
      await action();
    } catch (failure) {
      setError(describeFailure(failure));
    } finally {
      setBusyId(null);
    }
  };

  const removeUser = (user: AdminUser) => {
    if (!window.confirm(fill(copy.deleteUserConfirm, user.name))) {
      return;
    }

    void run(user.id, async () => {
      await deleteUserRequest(user.id);
      onUsersChange((users ?? []).filter((entry) => entry.id !== user.id));
    });
  };

  const removeCourier = (courier: CourierWithLoad) => {
    if (!window.confirm(fill(copy.deleteCourierConfirm, courier.name))) {
      return;
    }

    void run(courier.id, async () => {
      await deleteCourierRequest(courier.id);
      onCouriersChange(couriers.filter((entry) => entry.id !== courier.id));
    });
  };

  const toggleCourier = (courier: CourierWithLoad) =>
    void run(courier.id, async () => {
      const updated = await updateCourier(courier.id, {
        isActive: !courier.isActive,
      });
      onCouriersChange(
        couriers.map((entry) =>
          entry.id === courier.id ? { ...entry, ...updated } : entry,
        ),
      );
    });

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-brand-ink/8 bg-white p-4 sm:p-5">
          <h3 className="text-[15px] font-bold text-brand-ink">
            {copy.usersTitle}
          </h3>

          {users === null ? (
            <p role="status" className="mt-4 text-[13px] text-brand-ink/55">
              {content.loadingLabel}
            </p>
          ) : users.length === 0 ? (
            <p className="mt-4 text-[13px] text-brand-ink/55">
              {copy.emptyUsers}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-brand-ink/8">
              {users.map((user) => {
                const isSelf = user.id === signedInUser?.id;

                return (
                  <li key={user.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/12 text-[12px] font-bold text-brand"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-brand-ink">
                        {user.name}
                      </p>
                      {/* The address is long and rarely decisive — desktop only. */}
                      <p className="hidden truncate text-[12px] text-brand-ink/50 sm:block">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ROLE_STYLES[user.role]}`}
                      >
                        {copy.roleLabels[user.role]}
                      </span>
                      <span className="text-[11px] text-brand-ink/45">
                        {user.orderCount} {copy.orderCountLabel}
                      </span>
                    </div>
                    {!isSelf ? (
                      <button
                        type="button"
                        aria-label={`${copy.deleteUserLabel}: ${user.name}`}
                        disabled={busyId === user.id}
                        onClick={() => removeUser(user)}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-ink/12 text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-40"
                      >
                        {busyId === user.id ? (
                          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                        ) : (
                          <Trash2 aria-hidden="true" className="size-4" />
                        )}
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-brand-ink/8 bg-white p-4 sm:p-5">
          <h3 className="text-[15px] font-bold text-brand-ink">
            {copy.couriersTitle}
          </h3>

          {couriers.length === 0 ? (
            <p className="mt-4 text-[13px] text-brand-ink/55">
              {copy.emptyCouriers}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-brand-ink/8">
              {couriers.map((courier) => {
                const VehicleIcon = VEHICLE_ICONS[courier.vehicle];
                const isBusy = busyId === courier.id;

                return (
                  <li key={courier.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-ink/8 text-brand-ink"
                    >
                      <VehicleIcon aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-brand-ink">
                        {courier.name}
                        {!courier.isActive ? (
                          <span className="ml-2 rounded-full bg-brand-ink/8 px-2 py-0.5 text-[10px] font-semibold text-brand-ink/50">
                            {copy.inactiveLabel}
                          </span>
                        ) : null}
                      </p>
                      <p className="hidden items-center gap-2 truncate text-[12px] text-brand-ink/50 sm:flex">
                        <Phone aria-hidden="true" className="size-3" />
                        {courier.phone}
                        <span aria-hidden="true">·</span>
                        {copy.vehicleLabels[courier.vehicle]}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="flex items-center gap-1 text-[12px] font-semibold text-brand-ink">
                        <Star aria-hidden="true" className="size-3.5 fill-brand text-brand" />
                        {courier.rating.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-brand-ink/45">
                        {courier.activeDeliveries} {copy.activeDeliveriesLabel}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={`${courier.isActive ? copy.deactivateLabel : copy.activateLabel}: ${courier.name}`}
                        title={courier.isActive ? copy.deactivateLabel : copy.activateLabel}
                        disabled={isBusy}
                        onClick={() => toggleCourier(courier)}
                        className={`flex size-9 items-center justify-center rounded-full border transition-colors disabled:opacity-40 ${
                          courier.isActive
                            ? "border-brand-ink/12 text-brand-ink hover:border-brand hover:text-brand"
                            : "border-brand bg-brand/10 text-brand"
                        }`}
                      >
                        <Power aria-hidden="true" className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`${copy.deleteCourierLabel}: ${courier.name}`}
                        disabled={isBusy}
                        onClick={() => removeCourier(courier)}
                        className="flex size-9 items-center justify-center rounded-full border border-brand-ink/12 text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-40"
                      >
                        {isBusy ? (
                          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                        ) : (
                          <Trash2 aria-hidden="true" className="size-4" />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
