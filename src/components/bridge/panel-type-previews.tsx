import { PerimeterPanel } from "@/components/bridge/perimeter-panel";
import { SonarPanel } from "@/components/bridge/sonar-panel";
import { SpectrumPanel } from "@/components/bridge/spectrum-panel";

/** Temporary review stack — replace with the scenario selector in a later task. */
export function PanelTypePreviews() {
  return (
    <section className="dark bg-[#0A0F14] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <SonarPanel />
        <SpectrumPanel />
        <PerimeterPanel />
      </div>
    </section>
  );
}
