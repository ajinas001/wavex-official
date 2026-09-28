import Welcome from "@/components/obsidian/sections/Welcome";
import PlacesBento from "@/components/obsidian/sections/PlacesBento";
import PlacesAfter from "@/components/obsidian/sections/PlacesAfter";
import Objects from "@/components/obsidian/sections/Objects";
import OriginObjectsScrollSequence from "@/components/obsidian/sections/Services";
import Footer from "@/components/obsidian/sections/Footer";

export default function Home() {
  return (
    <>
      <Welcome />
      <PlacesBento />
      <PlacesAfter />
      <Objects />
      <OriginObjectsScrollSequence />
      <Footer />
    </>
  );
}