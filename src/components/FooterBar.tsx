import { useEffect, useMemo, useState } from "react";
import { VALENTINE_DATA } from "@/lib/valentineData";

const FooterBar = () => {
  const { status, heartRate, target, mode } = VALENTINE_DATA.footer;
  const heartbeatPattern = useMemo(() => [0, 1, 3, 6, 2, -1, -2, 0, 1, 4, 7, 3, 0, -1], []);
  const parsedBaseRate = useMemo(() => {
    const match = heartRate.match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : 110;
  }, [heartRate]);
  const heartRateUnit = useMemo(() => {
    const unit = heartRate.replace(/\d+/g, "").trim();
    return unit || "BPM";
  }, [heartRate]);
  const [displayHeartRate, setDisplayHeartRate] = useState(parsedBaseRate);

  useEffect(() => {
    setDisplayHeartRate(parsedBaseRate);
    let patternIndex = 0;
    const intervalId = window.setInterval(() => {
      patternIndex = (patternIndex + 1) % heartbeatPattern.length;
      setDisplayHeartRate(parsedBaseRate + heartbeatPattern[patternIndex]);
    }, 650);

    return () => window.clearInterval(intervalId);
  }, [parsedBaseRate, heartbeatPattern]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/15 bg-black/75 px-3 py-2.5 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 font-pixel text-[8px] sm:text-[9px] uppercase tracking-[0.06em]">
        <div className="flex flex-1 basis-[180px] items-center gap-2 whitespace-nowrap">
          <span className="text-white/65">SYSTEM_STATUS</span>
          <span className="text-[#ff3f67]">[{status}]</span>
        </div>
        <div className="flex flex-1 basis-[180px] items-center gap-2 whitespace-nowrap">
          <span className="text-white/65">HEART_RATE</span>
          <span className="text-[#ffb35a]">[{displayHeartRate}{heartRateUnit}]</span>
        </div>
        <div className="flex flex-1 basis-[180px] items-center gap-2 whitespace-nowrap">
          <span className="text-white/65">TARGET</span>
          <span className="text-[#62d6ff]">[{target}]</span>
        </div>
        <div className="flex flex-1 basis-[180px] items-center gap-2 whitespace-nowrap">
          <span className="text-white/65">MODE</span>
          <span className="text-[#d7a5ff]">[{mode}]</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterBar;
