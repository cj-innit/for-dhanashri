const DEFAULT_RATIO = 3 / 4;

const ratioCache = new Map<string, number>();
const inFlightCache = new Map<string, Promise<number>>();

const normalizeRatio = (ratio: number) => {
  if (Number.isFinite(ratio) && ratio > 0) return ratio;
  return DEFAULT_RATIO;
};

export const preloadFilmReelImage = (url: string): Promise<number> => {
  if (ratioCache.has(url)) return Promise.resolve(ratioCache.get(url)!);

  const inFlight = inFlightCache.get(url);
  if (inFlight) return inFlight;

  const loadPromise = new Promise<number>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    let settled = false;

    const resolveWith = (ratio: number) => {
      if (settled) return;
      settled = true;
      const safeRatio = normalizeRatio(ratio);
      ratioCache.set(url, safeRatio);
      inFlightCache.delete(url);
      resolve(safeRatio);
    };

    img.onload = () => {
      const ratio = img.naturalWidth / Math.max(img.naturalHeight, 1);
      if (typeof img.decode === "function") {
        void img.decode().catch(() => undefined);
      }
      resolveWith(ratio);
    };

    img.onerror = () => resolveWith(DEFAULT_RATIO);
    img.src = url;

    // Some cached images resolve synchronously and may skip load events.
    if (img.complete && img.naturalWidth > 0) {
      const ratio = img.naturalWidth / Math.max(img.naturalHeight, 1);
      resolveWith(ratio);
    }
  });

  inFlightCache.set(url, loadPromise);
  return loadPromise;
};

export const preloadFilmReelImages = async (urls: string[]): Promise<number[]> => {
  return Promise.all(urls.map((url) => preloadFilmReelImage(url)));
};
