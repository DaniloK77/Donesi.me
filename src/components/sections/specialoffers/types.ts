import type { Lang } from "@/utils/getDictionary";
import type {
  InviteFriendsContent,
  SpecialOffersHeroContent,
  WeeklyDealsContent,
} from "@/utils/getSpecialOffersDictionary";

export type WeeklyDealItem = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  menuCategory: string;
  originalPrice: number;
  discountedPrice: number;
  weeklyDiscountPercent: number;
  discountWeekStart: string | null;
  displayOrder: number;
};

export type WeeklyDealsGroup = {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
  };
  items: WeeklyDealItem[];
};

export type SpecialOffersHeroProps = {
  content: SpecialOffersHeroContent;
};

export type AllWeeklyDealsSectionProps = {
  lang: Lang;
  content: WeeklyDealsContent;
  deals: WeeklyDealsGroup[];
  hasError: boolean;
};

export type InviteFriendsSectionProps = {
  content: InviteFriendsContent;
};
