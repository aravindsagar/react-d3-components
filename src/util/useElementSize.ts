import { useResizeDetector } from 'react-resize-detector';

export function useElementSize() {
  // width and height can be undefined on first render which causes issues.
  // Provide safe default values.
  const { width = 1, height = 1, ref } = useResizeDetector();
  return { width, height, ref };
}
