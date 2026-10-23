import { ChartUploader } from "@/components/app/ChartUploader";

export const metadata = {
  title: "New Analysis | Ioscanchart",
  description: "Upload and analyze any trading chart across global and Indian markets.",
};

export default function WorkspacePage() {
  return <ChartUploader />;
}
