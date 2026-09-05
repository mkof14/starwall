import { ScenarioStill } from "@/components/bridge/scenario-still";

const steps = [
  {
    file: "radar-normal.png",
    text: "02:14 — a contact enters the 6 NM range with no AIS signal, on a bearing that could intercept M/Y Aurelia's course.",
  },
  {
    file: "risk-elevated.png",
    text: "StarWall correlates the radar and AIS feed within seconds and moves the risk level to Elevated.",
  },
  {
    file: "recommended-action.png",
    text: "The Bridge shows one clear recommendation: hail on VHF ch.16, increase watch, be ready to alter course if range closes under 1.0 NM.",
  },
  {
    file: "event-log-new.png",
    text: "The event is logged automatically, timestamped, ready for the morning report — nothing has to be written up by hand.",
  },
];

export function ScenarioWalkthrough() {
  return (
    <section className="bg-bridge-bg px-4 pb-4 pt-10 text-bridge-text md:px-6">
      <div className="mx-auto max-w-6xl space-y-10">
        <header>
          <p className="font-mono text-[10px] tracking-[0.2em] text-orange">
            SCENARIO
          </p>
          <h2 className="mt-2 font-ui text-2xl font-bold">Walkthrough</h2>
        </header>

        <ol className="space-y-10">
          {steps.map((step, index) => (
            <li
              key={step.file}
              className="grid items-center gap-6 md:grid-cols-2"
            >
              <p
                className={`text-base leading-relaxed text-bridge-text ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <span className="mr-2 font-mono text-xs text-orange">
                  0{index + 1}
                </span>
                {step.text}
              </p>
              <ScenarioStill file={step.file} />
            </li>
          ))}
        </ol>

        <p className="text-sm italic text-bridge-dim">
          Illustrative scenario. Try it yourself in the live demo below.
        </p>
      </div>
    </section>
  );
}
