import { min } from "lodash";
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
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: maxWidth
          ? min([window.innerWidth, maxWidth]) || 0
          : window.innerWidth,
        height: maxHeight
          ? min([window.innerHeight, maxHeight]) || 0
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
