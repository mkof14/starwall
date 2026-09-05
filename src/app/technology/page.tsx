import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technology",
};

const categories = [
  {
    name: "Vessel / site platform",
    connects:
      "Onboard networks, NMEA gateways, marina/estate infrastructure bus",
  },
  {
    name: "Navigation & marine electronics",
    connects: "NMEA0183/2000, AIS, GPS/GNSS, radar",
  },
  {
    name: "Video & optics",
    connects: "ONVIF, RTSP, PTZ, thermal cameras, EO/IR modules",
  },
  {
    name: "Perimeter & IoT",
    connects:
      "Modbus, MQTT, CAN, SNMP, perimeter and infrastructure sensors",
  },
  {
    name: "Drones & counter-UAS",
    connects: "RF drone detection, classification, geofencing",
  },
  {
    name: "Underwater",
    connects: "Sonar, underwater object and swimmer detection",
  },
  {
    name: "Satellite communications",
    connects:
      "Starlink, VSAT — both as a data channel and a monitored system",
  },
];

const partnerships = [
  {
    name: "Compatibility",
    body: "Any market device via open protocols",
  },
  {
    name: "StarWall Certified",
    body: "Technical validation, priority in client recommendations",
  },
  {
    name: "Technology Partner",
    body: "Joint development of integrations for new device classes",
  },
  {
    name: "Exclusive / OEM",
    body: "Joint product built to StarWall's configuration",
  },
];

export default function TechnologyPage() {
  return (
    <div className="bg-white text-navyText">
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 md:px-6 lg:py-20">
        <header className="max-w-3xl space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange">
            Technology
          </p>
          <h1 className="font-heading text-4xl font-bold text-navyText sm:text-5xl">
            What it connects to, and how
          </h1>
          <p className="text-base leading-relaxed text-grey">
            StarWall is not tied to one manufacturer. Its integration layer
            connects any modern equipment on the market through adapters —
            including newly released and specialized device classes.
          </p>
        </header>

        <section aria-labelledby="catalog-heading">
          <h2
            id="catalog-heading"
            className="font-heading text-3xl font-bold text-navyText"
          >
            Equipment catalog
          </h2>
          <div className="mt-5 overflow-x-auto border border-gray-200">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-navy text-sand">
                <tr>
                  <th className="px-4 py-3 font-heading text-base font-bold">
                    Category
                  </th>
                  <th className="px-4 py-3 font-heading text-base font-bold">
                    What connects
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((row) => (
                  <tr
                    key={row.name}
                    className="border-t border-gray-200 align-top"
                  >
                    <th className="px-4 py-3 font-bold text-navyText">
                      {row.name}
                    </th>
                    <td className="px-4 py-3 text-grey">{row.connects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="border-l-4 border-orange bg-orange/10 px-4 py-4 text-sm leading-relaxed text-navyText">
          Some equipment categories — for example RF/counter-drone detection or
          electronic warfare systems — require jurisdiction-specific export
          control and licensing review before deployment. StarWall&apos;s
          architecture supports these as optional modules; enabling any of them
          always goes through a separate legal review first, and any related
          response capability requires a licensed operator and human
          authorization. For details,{" "}
          <Link href="/contact" className="font-medium text-orange underline">
            contact us
          </Link>
          .
        </aside>

        <section aria-labelledby="oem-heading" className="space-y-5">
          <h2
            id="oem-heading"
            className="font-heading text-3xl font-bold text-navyText"
          >
            OEM partnership
          </h2>
          <ol className="space-y-3">
            {partnerships.map((step, index) => {
              const width = ["w-full max-w-md", "w-full max-w-lg", "w-full max-w-xl", "w-full"][
                index
              ];
              const tone = [
                "bg-white border-gray-200",
                "bg-sand/40 border-gray-200",
                "bg-navyText/5 border-navy/20",
                "bg-navy border-navy text-sand",
              ][index];
              return (
                <li key={step.name} className={`${width} border p-5 ${tone}`}>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-orange">
                    0{index + 1}
                  </p>
                  <h3
                    className={`mt-1 font-heading text-xl font-bold ${index === 3 ? "text-sand" : "text-navyText"}`}
                  >
                    {step.name === "StarWall Certified" ? (
                      <>
                        <span>Star</span>
                        <span className="text-orange">Wall</span> Certified
                      </>
                    ) : (
                      step.name
                    )}
                  </h3>
                  <p
                    className={`mt-2 text-sm ${index === 3 ? "text-sand/75" : "text-grey"}`}
                  >
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
