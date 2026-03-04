import SectionSilence from "./components/SectionSilence";
import SectionBuilding from "./components/SectionBuilding";
import SectionFlow from "./components/SectionFlow";
import SectionCalendar from "./components/SectionCalendar";
import SectionCTA from "./components/SectionCTA";

export default function App() {
  return (
    <div>
      <SectionSilence />
      <SectionBuilding />
      <SectionFlow />
      <SectionCalendar />
      <SectionCTA />
    </div>
  );
}
