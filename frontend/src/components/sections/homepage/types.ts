import type { Lang } from "@/utils/getDictionary";

export type HomepageSectionContent = Record<string, unknown>;

export type HomepageSectionProps = {
  lang: Lang;
  content: HomepageSectionContent;
};
