import "server-only";

import type { Lang } from "./getDictionary";

export type AuthFormContent = {
  eyebrow: string;
  title: string;
  description: string;
  availabilityLabel: string;
  authTabsLabel: string;
  loginTabLabel: string;
  registerTabLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneOptionalLabel: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  forgotPasswordLabel: string;
  orLabel: string;
  googleLabel: string;
  unavailableLabel: string;
  submitLabel: string;
  submittingLabel: string;
  alternatePrompt: string;
  alternateLinkLabel: string;
  validation: {
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  errors: {
    emailExists: string;
    invalidCredentials: string;
    rateLimited: string;
    generic: string;
  };
};

export type ProfileContent = {
  eyebrow: string;
  title: string;
  description: string;
  loadingLabel: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  roleLabel: string;
  verificationLabel: string;
  verifiedLabel: string;
  unverifiedLabel: string;
  noPhoneLabel: string;
  ordersTitle: string;
  ordersEmpty: string;
  roleLabels: Record<string, string>;
  editProfile: {
    editLabel: string;
    saveLabel: string;
    savingLabel: string;
    cancelLabel: string;
    successLabel: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    validation: {
      name: string;
      phone: string;
    };
    errors: {
      generic: string;
    };
  };
  location: {
    title: string;
    emptyLabel: string;
    setLabel: string;
    changeLabel: string;
    coordinatesLabel: string;
  };
};

export type AuthDictionary = {
  login: AuthFormContent;
  register: AuthFormContent;
  profile: ProfileContent;
};

const dictionaries: Record<Lang, () => Promise<AuthDictionary>> = {
  en: () =>
    import("@/data/pagesTextData/en/auth-page.json").then(
      (module) => module.default as AuthDictionary,
    ),
  me: () =>
    import("@/data/pagesTextData/me/auth-page.json").then(
      (module) => module.default as AuthDictionary,
    ),
};

export function getAuthDictionary(lang: Lang) {
  return dictionaries[lang]();
}
