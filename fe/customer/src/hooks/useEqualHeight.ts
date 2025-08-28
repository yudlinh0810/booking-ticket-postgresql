import { useEffect, useCallback, DependencyList } from "react";

/**
 * Custom hook để set equal height cho các elements
 * @param selector
 * @param dependencies
 * @param delay
 */
export const useEqualHeight = (
  selector: string,
  dependencies: DependencyList = [],
  delay: number = 100
): (() => void) => {
  const setEqualHeight = useCallback(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (elements.length === 0) return;

    // Reset height về auto
    elements.forEach((element) => {
      element.style.height = "auto";
    });

    // Tìm height lớn nhất
    let maxHeight = 0;
    elements.forEach((element) => {
      const height = element.offsetHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    elements.forEach((element) => {
      element.style.height = `${maxHeight}px`;
    });
  }, [selector]);

  useEffect(() => {
    // Set equal height sau khi component mount
    const timeoutId = setTimeout(setEqualHeight, delay);

    window.addEventListener("resize", setEqualHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", setEqualHeight);
    };
  }, [setEqualHeight, delay, ...dependencies]);

  return setEqualHeight;
};

export const useEqualHeightWithCSSModules = (className: string, scopeEl?: HTMLElement | null) => {
  useEffect(() => {
    if (!scopeEl) return;

    const elements = scopeEl.querySelectorAll<HTMLElement>(`.${className}`);
    if (!elements.length) return;

    // reset trước khi tính
    elements.forEach((el) => (el.style.height = "auto"));

    const maxHeight = Math.max(...Array.from(elements).map((el) => el.offsetHeight));

    elements.forEach((el) => (el.style.height = `${maxHeight}px`));
  }, [className, scopeEl]);
};

export const useMultipleEqualHeight = (
  selectors: string[],
  dependencies: DependencyList = [],
  delay: number = 100
): void => {
  useEffect(() => {
    const setEqualHeightForMultiple = () => {
      selectors.forEach((selector) => {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        if (elements.length === 0) return;

        // Reset height
        elements.forEach((element) => {
          element.style.height = "auto";
        });

        // Find max height
        let maxHeight = 0;
        elements.forEach((element) => {
          const height = element.offsetHeight;
          if (height > maxHeight) {
            maxHeight = height;
          }
        });

        // Set equal height
        elements.forEach((element) => {
          element.style.height = `${maxHeight}px`;
        });
      });
    };

    const timeoutId = setTimeout(setEqualHeightForMultiple, delay);
    window.addEventListener("resize", setEqualHeightForMultiple);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", setEqualHeightForMultiple);
    };
  }, [selectors, delay, ...dependencies]);
};
