import { PricingSection } from "@/components/marketing/PricingSection";
import { FaqSection } from "@/components/marketing/FaqSection";

export const metadata = {
  title: "Pricing Plans",
  description: "Transparent pricing for Iosnapchart. Free taste, monthly subscription, and lifetime access.",
};

export default function PricingPage() {
  return (
    <div className="py-12">
      <PricingSection />
      <FaqSection />
    </div>
  );
}
