import { VALENTINE_DATA } from "@/lib/valentineData";

const FooterBar = () => {
  const { status, heartRate, target, mode } = VALENTINE_DATA.footer;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[hsl(0,0%,5%)]/90 backdrop-blur-sm border-t border-[hsl(0,0%,20%)] px-4 py-2">
      <p className="font-outfit text-[10px] sm:text-xs text-[hsl(0,0%,60%)] tracking-wider text-center font-mono">
        SYSTEM_STATUS: [{status}] | HEART_RATE: [{heartRate}] | TARGET: [{target}] | MODE: [{mode}]
      </p>
    </footer>
  );
};

export default FooterBar;
