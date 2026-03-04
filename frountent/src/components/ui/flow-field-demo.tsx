import NeuralBackground from "@/components/ui/flow-field-background";

export default function NeuralHeroDemo() {
  return (
    <>
      {/* fullScreen prop makes canvas fixed behind everything */}
      <NeuralBackground
        fullScreen
        color="#818cf8" // Indigo-400
        trailOpacity={0.1} // Lower = longer trails
        speed={0.8}
      />
      {/* example content on top */}
      <div className="relative z-10">
        {/* your hero text/etc goes here */}
      </div>
    </>
  );
}
