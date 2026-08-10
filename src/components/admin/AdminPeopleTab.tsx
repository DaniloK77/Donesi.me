"use client";

import { Bike, Car, Phone, Star } from "lucide-react";

import type { AdminDictionary } from "@/utils/getAdminDictionary";
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

export default function AdminPeopleTab({
  content,
  users,
  couriers,
}: {
  content: AdminDictionary;
  users: AdminUser[] | null;
  couriers: CourierWithLoad[];
}) {
  const copy = content.people;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-brand-ink/8 bg-white p-5">
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
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
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
                  <p className="truncate text-[12px] text-brand-ink/50">
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
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-brand-ink/8 bg-white p-5">
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

              return (
                <li
                  key={courier.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
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
                    <p className="flex items-center gap-2 truncate text-[12px] text-brand-ink/50">
                      <Phone aria-hidden="true" className="size-3" />
                      {courier.phone}
                      <span aria-hidden="true">·</span>
                      {copy.vehicleLabels[courier.vehicle]}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="flex items-center gap-1 text-[12px] font-semibold text-brand-ink">
                      <Star
                        aria-hidden="true"
                        className="size-3.5 fill-brand text-brand"
                      />
                      {courier.rating.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-brand-ink/45">
                      {courier.activeDeliveries} {copy.activeDeliveriesLabel}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
