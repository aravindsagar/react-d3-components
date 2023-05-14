export interface Interactable<D> {
    onHover?: (item: D) => void;
    onSelect?: (item: D) => void;
}
