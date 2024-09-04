import {Tile3D} from './tile-3d';
import {TileGroup3D} from './tile-group-3d';

export class GroupedTilesArray {
  private array: (Tile3D | TileGroup3D)[];

  constructor(array?: (Tile3D | TileGroup3D)[]) {
    // For some reason, the more concise 'private array: (Tile3D | TileGroup3D)[] = []'
    // causes tests and imports to fail with errors about 'unexpected reserved keyword "private"'.
    this.array = array ?? [];
  }

  addTileOrGroup(other: Tile3D | TileGroup3D) {
    this.array.push(other);
  }

  /**
   * Adds the content of another GroupedTilesArray instance to this one.
   * Optionally, a maximum size can be specified which will add items in
   * order of _displayPriority up until the maximum size is reached.
   * @param other The other instance to read from
   * @param maxSize Optional maximum size of this GroupedTilesArray after
   * the operation.
   */
  addTilesOrGroups(other: GroupedTilesArray, maxSize: number = 0) {
    if (maxSize <= 0) {
      // unlimited, so we can ignore this condition. however, it's
      // not safe to just append the two lists as they may have REPLACE
      // strategies, so we could end up selecting both a parent and child.
      maxSize = Number.MAX_SAFE_INTEGER;
    }

    // add as many items as possible by display priority, up to the maximum size
    const replacedTileIds = new Set<string>();
    let itemsToAdd = maxSize - this.array.length;

    // shallow copy of other array to not modify other group
    const otherArray = other.array.slice();

    // ensure array is sorted DESCENDING by priority
    otherArray.sort((a, b) => b._displayPriority - a._displayPriority);

    while (itemsToAdd > 0 && otherArray.length > 0) {
      // popping off end means iterating the list ASCENDING in priority
      const nextItem = otherArray.pop()!; // safe assertion as we just checked the length

      const nextItemReplacedIds =
        nextItem instanceof Tile3D
          ? [nextItem._replacedTileId]
          : nextItem.tiles.map((tile) => tile._replacedTileId);

      const tilesInItem = nextItem instanceof Tile3D ? 1 : nextItem.tiles.length;
      if (tilesInItem > itemsToAdd) {
        // can't add the next item as it'd make the list too long
        break;
      }

      // add the item
      this.array.push(nextItem);
      itemsToAdd -= tilesInItem;

      // update replaced tile Ids (and increase the count if needed)
      for (let i = 0; i < nextItemReplacedIds.length; i++) {
        const replacedTileId = nextItemReplacedIds[i];

        if (replacedTileId !== undefined && !replacedTileIds.has(replacedTileId)) {
          // we're replacing a new item, so we need to add an extra item
          itemsToAdd++;
          replacedTileIds.add(replacedTileId);
        }
      }
    }

    // splice out any replaced tiles
    this.array = this.array
      .map((tileOrGroup) => {
        if (tileOrGroup instanceof TileGroup3D) {
          const filteredGroup = new TileGroup3D();

          for (let i = 0; i < tileOrGroup.tiles.length; i++) {
            const tile = tileOrGroup.tiles[i];
            if (!replacedTileIds.has(tile.id)) {
              filteredGroup.addTile(tile);
            }
          }

          return filteredGroup.tiles.length > 0 ? filteredGroup : null;
        }

        return !replacedTileIds.has(tileOrGroup.id) ? tileOrGroup : null;
      })
      .filter((item): item is Tile3D | TileGroup3D => item !== null);
  }

  numTiles() {
    return this.array.reduce(
      (total, group) => total + (group instanceof Tile3D ? 1 : group.tiles.length),
      /* initial value */ 0
    );
  }

  flatten(): Tile3D[] {
    return this.array.flatMap((element) => (element instanceof Tile3D ? element : element.tiles));
  }

  forEach(callback: (tile: Tile3D) => void) {
    for (const element of this.array) {
      if (element instanceof Tile3D) {
        callback(element);
      } else {
        element.tiles.forEach(callback);
      }
    }
  }

  /**
   * Very similar to {@link spliceHighestPriorityTilesOrGroups}, but with two key differences:
   *   1. If the highest-priority element is a group with multiple tiles,
   *      {@link spliceHighestPriorityTilesOrGroups(1)} would return an empty array,
   *      whereas this will return the group.
   *   2. This is more efficient because it only performs the O(n) comparisons required to
   *      find the min. It does not sort the entire array.
   */
  spliceHighestPriorityTileOrGroup(): Tile3D | TileGroup3D | undefined {
    let minDisplayPriority = Number.MAX_VALUE;
    let minIndex = -1;
    for (let i = 0; i < this.array.length; i++) {
      const group = this.array[i];
      if (group._displayPriority < minDisplayPriority) {
        minDisplayPriority = group._displayPriority;
        minIndex = i;
      }
    }

    if (minIndex === -1) {
      return undefined;
    }

    const highestPriority = this.array[minIndex];

    // Remove the highest priority element from the array.
    this.array.splice(minIndex, 1);

    return highestPriority;
  }

  spliceHighestPriorityTilesOrGroups(maxNumTiles: number): GroupedTilesArray {
    if (maxNumTiles === 0 || this.numTiles() <= maxNumTiles) {
      // Ensure that in all execution paths, the spliced tiles are returned in a
      // separate object, while the (in this case, empty set of) unspliced tiles
      // remain in the original object.
      const selected = this.array;
      this.array = [];
      return new GroupedTilesArray(selected);
    }

    this.array.sort((a, b) => a._displayPriority - b._displayPriority);

    let i = 0;
    let prospectiveSelectedTilesCount = 0;
    for (i = 0; i < this.array.length - 1; i++) {
      // Look ahead, see if the next element would overspill the maxNumTiles, and if so,
      // return everything up to (but not including) the next element in order to stay
      // strictly below the maxNumTiles limit.
      const element = this.array[i + 1];
      prospectiveSelectedTilesCount += element instanceof Tile3D ? 1 : element.tiles.length;
      if (prospectiveSelectedTilesCount > maxNumTiles) {
        break;
      }
    }

    const selectedTileGroups = this.array.splice(0, i);

    return new GroupedTilesArray(selectedTileGroups);
  }
}
