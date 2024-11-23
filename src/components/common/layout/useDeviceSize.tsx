import { useState, useEffect } from "react";

interface UseDeviceSizeProps {
  maxWidth?: number;
  maxHeight?: number;
}

interface DeviceSize {
  width: number;
  height: number;
}

function useDeviceSize({
  maxWidth = 500,
  maxHeight,
}: UseDeviceSizeProps = {}): DeviceSize {
  const [size, setSize] = useState<DeviceSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: maxWidth
          ? Math.min(window.innerWidth, maxWidth)
          : window.innerWidth,
        height: maxHeight
          ? Math.min(window.innerHeight, maxHeight)
          : window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // initial call to set size

    return () => window.removeEventListener("resize", handleResize);
  }, [maxWidth, maxHeight]);

  return size;
}

export default useDeviceSize;
