import Welcome from "@/components/obsidian/sections/Welcome";
import PlacesBento from "@/components/obsidian/sections/PlacesBento";
import PlacesAfter from "@/components/obsidian/sections/PlacesAfter";
import Objects from "@/components/obsidian/sections/Objects";
import Connection from "@/components/obsidian/sections/Connection";
import Updates from "@/components/obsidian/sections/Updates";
import People from "@/components/obsidian/sections/People";
import Admission from "@/components/obsidian/sections/Admission";
import Footer from "@/components/obsidian/sections/Footer";

export default function Home() {
  return (
    <>
      <Welcome />
      <PlacesBento />
      <PlacesAfter />
      <Objects />
      <Connection />
      <Updates />
      <People />
      <Admission />
      <Footer />
    </>
  );
}