"use client";

import { useCallback, useEffect, useState } from "react";
import { Bike, Store, TriangleAlert, Users, UtensilsCrossed } from "lucide-react";

import type { Lang } from "@/utils/getDictionary";
import type { AdminDictionary } from "@/utils/getAdminDictionary";
import type { TrackOrderDictionary } from "@/utils/getTrackOrderDictionary";
import {
  getOverview,
  listAllOrders,
  listCouriers,
  listRestaurants,
  listUsers,
} from "./api";
import AdminOrdersTab from "./AdminOrdersTab";
import AdminRestaurantsTab from "./AdminRestaurantsTab";
import AdminPeopleTab from "./AdminPeopleTab";
import type {
  AdminOrder,
  AdminOverview,
  AdminRestaurant,
  AdminUser,
  CourierWithLoad,
} from "./types";

type TabKey = "orders" | "restaurants" | "people";

const ACTIVE_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
] as const;

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-brand-ink/8 bg-white px-4 py-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-ink/45">
          {label}
        </p>
        <p className="text-[18px] font-bold text-brand-ink">{value}</p>
      </div>
    </div>
  );
}

export default function AdminPanel({
  lang,
  content,
  deliveryContent,
}: {
  lang: Lang;
  content: AdminDictionary;
  /** Reused from the tracking page so the admin sees the same courier map. */
  deliveryContent: TrackOrderDictionary["delivery"];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("orders");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [couriers, setCouriers] = useState<CourierWithLoad[]>([]);
  const [restaurants, setRestaurants] = useState<AdminRestaurant[] | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setError(null);

    try {
      const [nextOverview, nextOrders, nextCouriers] = await Promise.all([
        getOverview(),
        listAllOrders(),
        listCouriers(),
      ]);

      setOverview(nextOverview);
      setOrders(nextOrders);
      setCouriers(nextCouriers);
    } catch {
      setError("generic");
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([getOverview(), listAllOrders(), listCouriers()])
      .then(([nextOverview, nextOrders, nextCouriers]) => {
        if (isCancelled) {
          return;
        }
        setOverview(nextOverview);
        setOrders(nextOrders);
        setCouriers(nextCouriers);
      })
      .catch(() => {
        if (!isCancelled) {
          setError("generic");
          setOrders([]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Restaurants and users are only fetched when their tab is first opened.
  useEffect(() => {
    let isCancelled = false;

    if (activeTab === "restaurants" && restaurants === null) {
      listRestaurants()
        .then((result) => {
          if (!isCancelled) {
            setRestaurants(result);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setError("generic");
            setRestaurants([]);
          }
        });
    }

    if (activeTab === "people" && users === null) {
      listUsers()
        .then((result) => {
          if (!isCancelled) {
            setUsers(result);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setError("generic");
            setUsers([]);
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [activeTab, restaurants, users]);

  const activeOrderCount = overview
    ? ACTIVE_STATUSES.reduce(
        (sum, status) => sum + (overview.orders.byStatus[status] ?? 0),
        0,
      )
    : 0;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "orders", label: content.tabs.orders },
    { key: "restaurants", label: content.tabs.restaurants },
    { key: "people", label: content.tabs.people },
  ];

  return (
    <section className="mx-auto flex w-[calc(100%-2rem)] max-w-382 flex-col gap-6">
      {error ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="flex items-center gap-2 text-[13px] text-red-700">
            <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
            {content.genericErrorLabel}
          </p>
          <button
            type="button"
            onClick={loadDashboard}
            className="shrink-0 rounded-full border border-red-300 px-3 py-1.5 text-[12px] font-semibold text-red-700 transition-colors hover:bg-red-100"
          >
            {content.retryLabel}
          </button>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<UtensilsCrossed aria-hidden="true" className="size-5" />}
          label={content.overview.totalOrders}
          value={overview ? overview.orders.total : "—"}
        />
        <StatCard
          icon={<Store aria-hidden="true" className="size-5" />}
          label={content.overview.restaurants}
          value={overview ? overview.restaurants : "—"}
        />
        <StatCard
          icon={<Users aria-hidden="true" className="size-5" />}
          label={content.overview.users}
          value={overview ? overview.users : "—"}
        />
        <StatCard
          icon={<Bike aria-hidden="true" className="size-5" />}
          label={content.overview.couriers}
          value={overview ? overview.couriers : "—"}
        />
      </div>

      <div
        role="tablist"
        aria-label={content.title}
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              activeTab === tab.key
                ? "bg-brand-ink text-white"
                : "border border-brand-ink/12 text-brand-ink/65 hover:border-brand hover:text-brand"
            }`}
          >
            {tab.label}
            {tab.key === "orders" && activeOrderCount > 0 ? (
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${
                  activeTab === "orders"
                    ? "bg-white/20 text-white"
                    : "bg-brand/12 text-brand"
                }`}
              >
                {activeOrderCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {activeTab === "orders" ? (
        <AdminOrdersTab
          lang={lang}
          content={content}
          deliveryContent={deliveryContent}
          orders={orders}
          couriers={couriers}
          onOrdersChange={setOrders}
          onRefresh={loadDashboard}
        />
      ) : null}

      {activeTab === "restaurants" ? (
        <AdminRestaurantsTab
          lang={lang}
          content={content}
          restaurants={restaurants}
        />
      ) : null}

      {activeTab === "people" ? (
        <AdminPeopleTab content={content} users={users} couriers={couriers} />
      ) : null}
    </section>
  );
}
