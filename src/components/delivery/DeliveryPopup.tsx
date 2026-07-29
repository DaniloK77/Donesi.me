"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import {
  Bike,
  Check,
  Loader2,
  MapPin,
  Store,
  X,
} from "lucide-react";

import type { DeliveryCoordinates } from "./DeliveryLocationPicker";

const DeliveryLocationPicker = dynamic(
  () => import("./DeliveryLocationPicker"),
  { ssr: false },
);

export type DeliveryPopupStep =
  | "enter-address"
  | "address-confirmed"
  | "order-now";

type PopupCopy = {
  stepLabel: string;
  addressLabel: string;
  addressPlaceholder: string;
  cityLabel: string;
  find: string;
  checking: string;
  chooseOnMap: string;
  mapInstructions: string;
  confirmMapLocation: string;
  cancelMap: string;
  mapMarkerLabel: string;
  removeMapMarker: string;
  mapSelectedAddress: string;
  streetSearchLoading: string;
  noStreetResults: string;
  selectedStreetHint: string;
  collectAlternative: string;
  enterTitle: string;
  enterDescription: string;
  confirmedTitle: string;
  confirmedDescription: string;
  coordinatesLabel: string;
  change: string;
  continue: string;
  orderTitle: string;
  minimumDelivery: string;
  deliverOrder: string;
  collectOrder: string;
  or: string;
  cancel: string;
  close: string;
  genericError: string;
  locationNotRecognizedError: string;
  houseNumberRequiredError: string;
  outsidePodgoricaError: string;
};

type LocationCheckResponse = {
  isWithinPodgorica: boolean;
  location: {
    address: string;
    city: "Podgorica";
    latitude: number;
    longitude: number;
  };
};

type PodgoricaStreet = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const popupCopy: Record<"en" | "me", PopupCopy> = {
  en: {
    stepLabel: "Step",
    addressLabel: "Street and number",
    addressPlaceholder: "Enter street and number",
    cityLabel: "City",
    find: "Confirm",
    checking: "Checking",
    chooseOnMap: "Choose location on map",
    mapInstructions: "Click the map to place the pin on your location.",
    confirmMapLocation: "Confirm this location",
    cancelMap: "Back",
    mapMarkerLabel: "Selected delivery location",
    removeMapMarker: "Remove marker",
    mapSelectedAddress: "Location selected on map",
    streetSearchLoading: "Searching streets...",
    noStreetResults: "No matching streets",
    selectedStreetHint: "Enter the house number after the comma.",
    collectAlternative: "I will collect my order",
    enterTitle: "Where should we deliver?",
    enterDescription:
      "Enter your street and number in Podgorica or choose the location on the map.",
    confirmedTitle: "Address confirmed!",
    confirmedDescription:
      "This location is inside our Podgorica delivery area.",
    coordinatesLabel: "Map location",
    change: "Change",
    continue: "Continue",
    orderTitle: "Order Now",
    minimumDelivery: "Minimum Delivery is €10",
    deliverOrder: "Deliver my order",
    collectOrder: "I will come & collect",
    or: "or",
    cancel: "Cancel & Go back",
    close: "Close delivery popup",
    genericError:
      "We could not check the location. Please try again.",
    locationNotRecognizedError:
      "Location was not recognized. Check the street or choose a location on the map.",
    houseNumberRequiredError:
      "Select a street and enter the house number after the comma, for example: Njegoševa, 12.",
    outsidePodgoricaError:
      "The selected location is outside the Podgorica delivery area.",
  },
  me: {
    stepLabel: "Korak",
    addressLabel: "Ulica i broj",
    addressPlaceholder: "Unesite ulicu i broj",
    cityLabel: "Grad",
    find: "Potvrdi",
    checking: "Provjera",
    chooseOnMap: "Izaberi lokaciju na mapi",
    mapInstructions:
      "Kliknite na mapu da postavite pin na svoju lokaciju.",
    confirmMapLocation: "Potvrdi ovu lokaciju",
    cancelMap: "Nazad",
    mapMarkerLabel: "Izabrana lokacija za dostavu",
    removeMapMarker: "Ukloni marker",
    mapSelectedAddress: "Lokacija izabrana na mapi",
    streetSearchLoading: "Pretraga ulica...",
    noStreetResults: "Nema pronađenih ulica",
    selectedStreetHint: "Unesite broj ulice nakon zareza.",
    collectAlternative: "Ja ću preuzeti porudžbinu",
    enterTitle: "Gdje dostavljamo?",
    enterDescription:
      "Unesite ulicu i broj u Podgorici ili izaberite lokaciju na mapi.",
    confirmedTitle: "Adresa je potvrđena!",
    confirmedDescription:
      "Lokacija se nalazi unutar područja dostave u Podgorici.",
    coordinatesLabel: "Lokacija na mapi",
    change: "Promijeni",
    continue: "Nastavi",
    orderTitle: "Naruči sada",
    minimumDelivery: "Minimalna vrijednost dostave je 10 €",
    deliverOrder: "Dostavi moju porudžbinu",
    collectOrder: "Ja ću doći po porudžbinu",
    or: "ili",
    cancel: "Otkaži i vrati se nazad",
    close: "Zatvori prozor za dostavu",
    genericError:
      "Lokaciju trenutno nije moguće provjeriti. Pokušajte ponovo.",
    locationNotRecognizedError:
      "Lokacija nije prepoznata. Provjerite unijetu ulicu ili izaberite lokaciju na mapi.",
    houseNumberRequiredError:
      "Izaberite ulicu i nakon zareza unesite broj, na primjer: Njegoševa, 12.",
    outsidePodgoricaError:
      "Izabrana lokacija je van područja dostave u Podgorici.",
  },
};

const stepImages: Partial<Record<DeliveryPopupStep, string>> = {
  "enter-address": "/images/delivery-popup/popup-1.png",
  "address-confirmed": "/images/delivery-popup/popup-2.png",
};

const stepNumbers: Record<DeliveryPopupStep, number> = {
  "enter-address": 1,
  "address-confirmed": 2,
  "order-now": 3,
};

function hasValidHouseNumber(
  address: string,
  streetName: string,
) {
  const escapedStreetName = streetName.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );

  return new RegExp(
    `^${escapedStreetName}\\s*,\\s*\\d+[a-zA-Z]?(?:\\/\\d+)?\\s*$`,
    "i",
  ).test(address.trim());
}

export default function DeliveryPopup() {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "me";
  const copy = popupCopy[lang];
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] =
    useState<DeliveryPopupStep>("enter-address");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] =
    useState<DeliveryCoordinates | null>(null);
  const [selectedStreet, setSelectedStreet] =
    useState<PodgoricaStreet | null>(null);
  const [streetSuggestions, setStreetSuggestions] = useState<
    PodgoricaStreet[]
  >([]);
  const [isSearchingStreets, setIsSearchingStreets] =
    useState(false);
  const [
    hasCompletedStreetSearch,
    setHasCompletedStreetSearch,
  ] = useState(false);
  const [isMapSelection, setIsMapSelection] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const streetSearchQuery = address.split(",")[0].trim();

  useEffect(() => {
    if (
      step !== "enter-address" ||
      isMapSelection ||
      selectedStreet ||
      streetSearchQuery.length < 2
    ) {
      return;
    }

    const abortController = new AbortController();
    const searchTimer = window.setTimeout(async () => {
      setIsSearchingStreets(true);

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ??
          "http://localhost:5001";
        const response = await fetch(
          `${apiUrl}/api/streets?query=${encodeURIComponent(streetSearchQuery)}`,
          {
            signal: abortController.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Street search failed");
        }

        const streets = (await response.json()) as PodgoricaStreet[];
        setStreetSuggestions(streets);
        setHasCompletedStreetSearch(true);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setStreetSuggestions([]);
        setHasCompletedStreetSearch(true);
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearchingStreets(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(searchTimer);
      abortController.abort();
    };
  }, [
    isMapSelection,
    selectedStreet,
    step,
    streetSearchQuery,
  ]);

  const closePopup = () => setIsOpen(false);

  const checkLocation = async (
    deliveryCoordinates: DeliveryCoordinates,
  ) => {
    setValidationError("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
      const response = await fetch(
        `${apiUrl}/api/delivery/check-location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: address.trim(),
            city: "Podgorica",
            ...deliveryCoordinates,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Location check failed");
      }

      const result = (await response.json()) as LocationCheckResponse;

      if (!result.isWithinPodgorica) {
        setValidationError(copy.outsidePodgoricaError);
        return;
      }

      setCoordinates({
        latitude: result.location.latitude,
        longitude: result.location.longitude,
      });
      setStep("address-confirmed");
    } catch {
      setValidationError(copy.genericError);
    }
  };

  const selectStreet = (street: PodgoricaStreet) => {
    setSelectedStreet(street);
    setAddress(`${street.name}, `);
    setCoordinates({
      latitude: street.latitude,
      longitude: street.longitude,
    });
    setStreetSuggestions([]);
    setHasCompletedStreetSearch(false);
    setIsSearchingStreets(false);
    setValidationError("");
  };

  const updateAddress = (nextAddress: string) => {
    const keepsSelectedStreet =
      selectedStreet &&
      nextAddress
        .toLocaleLowerCase()
        .startsWith(
          `${selectedStreet.name.toLocaleLowerCase()},`,
        );

    setAddress(nextAddress);
    setIsMapSelection(false);
    setValidationError("");
    setHasCompletedStreetSearch(false);
    setIsSearchingStreets(false);

    if (!keepsSelectedStreet) {
      setSelectedStreet(null);
      setCoordinates(null);
      setStreetSuggestions([]);
    }

    if (nextAddress.split(",")[0].trim().length < 2) {
      setStreetSuggestions([]);
    }
  };

  const submitAddress = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!address.trim() || isChecking) {
      return;
    }

    setIsChecking(true);
    setValidationError("");

    try {
      if (isMapSelection && coordinates) {
        await checkLocation(coordinates);
        return;
      }

      if (!selectedStreet) {
        setValidationError(copy.locationNotRecognizedError);
        return;
      }

      if (!hasValidHouseNumber(address, selectedStreet.name)) {
        setValidationError(copy.houseNumberRequiredError);
        return;
      }

      const matchedCoordinates = {
        latitude: selectedStreet.latitude,
        longitude: selectedStreet.longitude,
      };

      setCoordinates(matchedCoordinates);
      await checkLocation(matchedCoordinates);
    } catch {
      setValidationError(copy.genericError);
    } finally {
      setIsChecking(false);
    }
  };

  const confirmMapLocation = (
    selectedCoordinates: DeliveryCoordinates,
  ) => {
    setCoordinates(selectedCoordinates);
    setSelectedStreet(null);
    setStreetSuggestions([]);
    setHasCompletedStreetSearch(false);
    setIsSearchingStreets(false);
    setIsMapSelection(true);
    setAddress(copy.mapSelectedAddress);
    setIsMapOpen(false);
    setValidationError("");
  };

  const clearMapSelection = () => {
    setAddress("");
    setCoordinates(null);
    setSelectedStreet(null);
    setStreetSuggestions([]);
    setHasCompletedStreetSearch(false);
    setIsSearchingStreets(false);
    setIsMapSelection(false);
    setIsMapOpen(false);
    setValidationError("");
  };

  const resetAddress = () => {
    setStep("enter-address");
    if (isMapSelection) {
      setAddress("");
      setCoordinates(null);
      setIsMapSelection(false);
    }
    setValidationError("");
  };

  if (!isOpen) {
    return null;
  }

  if (step === "order-now") {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#232323] p-4 2xl:p-12">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="delivery-popup-title"
          className="relative flex h-[min(880px,calc(100vh-2rem))] w-full max-w-317.5 flex-col items-center rounded-xl bg-white px-16 py-20 text-center shadow-[20px_24px_44px_rgba(0,0,0,0.5)] 2xl:h-[min(880px,calc(100vh-6rem))]"
          onClick={(event) => event.stopPropagation()}
        >
          <CloseButton label={copy.close} onClick={closePopup} />

          <p className="absolute left-8 top-7 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-ink/40">
            {copy.stepLabel} 3 / 3
          </p>

          <h2
            id="delivery-popup-title"
            className="text-[64px] font-bold leading-none tracking-[-0.03em] text-brand-ink"
          >
            {copy.orderTitle}
          </h2>
          <p className="mt-4 text-[22px] text-black">
            {copy.minimumDelivery}
          </p>

          <div className="mt-[clamp(40px,8vh,84px)] flex w-full max-w-162.5 flex-col gap-[clamp(20px,3vh,32px)]">
            <button
              type="button"
              onClick={closePopup}
              className="grid h-[clamp(96px,14vh,140px)] grid-cols-[72px_1fr_72px] items-center rounded-full bg-brand-ink px-8 text-white transition-transform hover:-translate-y-1"
            >
              <Bike
                aria-hidden="true"
                className="size-14 justify-self-center text-[#2cad0b]"
                strokeWidth={3}
              />
              <span className="text-center text-[22px] font-bold leading-7">
                {copy.deliverOrder}
              </span>
              <span aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={closePopup}
              className="grid h-[clamp(96px,14vh,140px)] grid-cols-[72px_1fr_72px] items-center rounded-full bg-brand px-8 text-brand-ink transition-transform hover:-translate-y-1"
            >
              <Store
                aria-hidden="true"
                className="size-14 justify-self-center"
                strokeWidth={3}
              />
              <span className="text-center text-[22px] font-bold leading-7">
                {copy.collectOrder}
              </span>
              <span aria-hidden="true" />
            </button>
          </div>

          <div className="mt-auto flex w-full max-w-142.5 items-center gap-10">
            <span className="h-0.75 flex-1 bg-brand" />
            <span className="text-[18px] font-bold text-black">
              {copy.or}
            </span>
            <span className="h-0.75 flex-1 bg-brand" />
          </div>

          <button
            type="button"
            onClick={closePopup}
            className="mt-5 text-[17px] font-bold text-brand-ink underline underline-offset-3"
          >
            {copy.cancel}
          </button>
        </section>
      </div>
    );
  }

  const imageUrl = stepImages[step];
  const isConfirmed = step === "address-confirmed";
  const title = isConfirmed ? copy.confirmedTitle : copy.enterTitle;
  const description = isConfirmed
    ? copy.confirmedDescription
    : copy.enterDescription;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#232323] p-4 2xl:p-12">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-popup-title"
        className="relative grid h-[min(880px,calc(100vh-2rem))] w-full max-w-317.5 grid-cols-[1.02fr_0.98fr] rounded-xl bg-white shadow-[20px_24px_44px_rgba(0,0,0,0.5)] 2xl:h-[min(880px,calc(100vh-6rem))]"
        onClick={(event) => event.stopPropagation()}
      >
        <CloseButton label={copy.close} onClick={closePopup} />

        {isMapOpen ? (
          <DeliveryLocationPicker
            initialCoordinates={coordinates}
            confirmLabel={copy.confirmMapLocation}
            cancelLabel={copy.cancelMap}
            instructions={copy.mapInstructions}
            markerLabel={copy.mapMarkerLabel}
            removeMarkerLabel={copy.removeMapMarker}
            onCancel={() => setIsMapOpen(false)}
            onClear={clearMapSelection}
            onConfirm={confirmMapLocation}
          />
        ) : null}

        <div className="relative min-h-0 overflow-hidden rounded-l-xl bg-brand-ink">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              priority
              sizes="635px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col justify-center overflow-y-auto rounded-r-xl bg-white px-12 py-8 2xl:px-16 2xl:py-16">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand">
            {copy.stepLabel} {stepNumbers[step]} / 3
          </p>

          <div className="mt-4 flex size-14 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand 2xl:mt-8 2xl:size-16">
            {isConfirmed ? (
              <Check aria-hidden="true" className="size-7 2xl:size-8" />
            ) : (
              <MapPin aria-hidden="true" className="size-7 2xl:size-8" />
            )}
          </div>

          <h2
            id="delivery-popup-title"
            className="mt-4 text-[40px] font-bold leading-[1.08] tracking-[-0.03em] text-brand-ink 2xl:mt-7 2xl:text-[46px]"
          >
            {title}
          </h2>
          <p className="mt-3 max-w-115 text-[15px] leading-6 text-brand-ink/60 2xl:mt-5 2xl:text-[16px] 2xl:leading-7">
            {description}
          </p>

          {isConfirmed ? (
            <div className="mt-5 2xl:mt-10">
              <div className="rounded-xl border-2 border-brand bg-brand/5 px-5 py-4">
                <div className="flex items-start justify-between gap-5">
                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-ink/45">
                      {copy.addressLabel}
                    </span>
                    <span className="mt-1 block text-[17px] font-bold leading-6 text-brand-ink">
                      {address}
                    </span>
                    <span className="mt-1 block text-[14px] text-brand-ink/60">
                      Podgorica
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={resetAddress}
                    className="shrink-0 rounded-full border border-brand px-5 py-2 text-[13px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                  >
                    {copy.change}
                  </button>
                </div>
                {coordinates ? (
                  <p className="mt-3 border-t border-brand/20 pt-3 text-[12px] text-brand-ink/50">
                    {copy.coordinatesLabel}:{" "}
                    {coordinates.latitude.toFixed(5)},{" "}
                    {coordinates.longitude.toFixed(5)}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setStep("order-now")}
                className="mt-3 flex h-13 w-full items-center justify-center rounded-xl bg-brand-ink text-[16px] font-bold text-white transition-colors hover:bg-brand 2xl:mt-4 2xl:h-15"
              >
                {copy.continue}
              </button>
            </div>
          ) : (
            <form onSubmit={submitAddress} className="mt-5 2xl:mt-9">
              <label
                htmlFor="delivery-address"
                className="text-[13px] font-semibold text-brand-ink"
              >
                {copy.addressLabel}
              </label>
              <div className="relative mt-2">
                <input
                  id="delivery-address"
                  value={address}
                  onChange={(event) =>
                    updateAddress(event.target.value)
                  }
                  placeholder={copy.addressPlaceholder}
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={
                    isSearchingStreets ||
                    streetSuggestions.length > 0 ||
                    hasCompletedStreetSearch
                  }
                  aria-controls="delivery-street-suggestions"
                  className="h-13 w-full rounded-xl border border-black/15 bg-white px-5 pr-12 text-[16px] text-brand-ink outline-none transition-colors placeholder:text-brand-ink/35 focus:border-brand 2xl:h-14"
                />

                {selectedStreet ? (
                  <Check
                    aria-label={copy.selectedStreetHint}
                    className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-emerald-600"
                  />
                ) : null}

                {isSearchingStreets ||
                streetSuggestions.length > 0 ||
                (!selectedStreet && hasCompletedStreetSearch) ? (
                  <div
                    id="delivery-street-suggestions"
                    role="listbox"
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-56 overflow-y-auto rounded-xl border border-black/10 bg-white p-1.5 shadow-xl"
                  >
                    {isSearchingStreets ? (
                      <p className="flex items-center gap-2 px-3 py-2.5 text-[13px] text-brand-ink/55">
                        <Loader2
                          aria-hidden="true"
                          className="size-4 animate-spin text-brand"
                        />
                        {copy.streetSearchLoading}
                      </p>
                    ) : streetSuggestions.length > 0 ? (
                      streetSuggestions.map((street) => (
                        <button
                          key={street.id}
                          type="button"
                          role="option"
                          aria-selected="false"
                          onClick={() => selectStreet(street)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-brand-ink transition-colors hover:bg-brand/10 focus:bg-brand/10 focus:outline-none"
                        >
                          <MapPin
                            aria-hidden="true"
                            className="size-4 shrink-0 text-brand"
                          />
                          {street.name}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2.5 text-[13px] text-brand-ink/55">
                        {copy.noStreetResults}
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              {selectedStreet ? (
                <p className="mt-2 text-[12px] font-medium text-emerald-700">
                  {copy.selectedStreetHint}
                </p>
              ) : null}

              <div className="mt-3 flex h-13 items-center gap-3 rounded-xl border border-black/10 bg-black/[0.025] px-5 2xl:h-14">
                <MapPin
                  aria-hidden="true"
                  className="size-5 text-brand"
                />
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-ink/40">
                    {copy.cityLabel}
                  </span>
                  <span className="text-[15px] font-bold text-brand-ink">
                    Podgorica
                  </span>
                </span>
              </div>

              {validationError ? (
                <p
                  role="alert"
                  className="mt-3 text-[13px] font-medium leading-5 text-red-600"
                >
                  {validationError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!address.trim() || isChecking}
                className="mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40 2xl:mt-4 2xl:h-14"
              >
                {isChecking ? (
                  <Loader2
                    aria-hidden="true"
                    className="size-5 animate-spin"
                  />
                ) : null}
                {isChecking ? copy.checking : copy.find}
              </button>

              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand text-[14px] font-semibold text-brand transition-colors hover:bg-brand/5 2xl:h-12"
              >
                <MapPin aria-hidden="true" className="size-5" />
                {copy.chooseOnMap}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => setStep("order-now")}
            className="mt-4 self-start text-[14px] font-semibold text-brand-ink underline underline-offset-4 2xl:mt-7"
          >
            {copy.collectAlternative}
          </button>
        </div>
      </section>
    </div>
  );
}

function CloseButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute right-0 top-0 z-40 flex size-22 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-ink text-white shadow-xl transition-colors hover:bg-brand"
    >
      <X aria-hidden="true" className="size-10" strokeWidth={3} />
    </button>
  );
}
