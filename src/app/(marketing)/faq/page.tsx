import { FaqSection } from "@/components/marketing/FaqSection";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Common questions about Iosnapchart, chart analysis, supported markets, and risk disclosure.",
};

export default function FaqPage() {
  return (
    <div className="py-12">
      <FaqSection />
    </div>
  );
}
