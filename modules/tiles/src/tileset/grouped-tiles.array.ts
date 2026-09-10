// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {Tile3D} from './tile-3d';
import {TileGroup3D} from './tile-group-3d';

type TileOrGroup = Tile3D | TileGroup3D;

export class GroupedTilesArray {
  private array: TileOrGroup[];

  constructor(array: TileOrGroup[] = []) {
    this.array = array;
  }

  addTileOrGroup(other: TileOrGroup): void {
    this.array.push(other);
  }

  /**
   * Adds entries by priority without allowing a REPLACE descendant and its
   * replaced ancestor to be selected together.
   */
  addTilesOrGroups(other: GroupedTilesArray, maxNumTiles = 0): void {
    const maximum = maxNumTiles > 0 ? maxNumTiles : Number.MAX_SAFE_INTEGER;
    const candidates = [...this.array, ...other.array].sort(
      (a, b) => a._displayPriority - b._displayPriority
    );
    this.array = [];

    for (const candidate of candidates) {
      const replacedIds = new Set(
        this.getTiles(candidate)
          .map((tile) => tile._replacedTileId)
          .filter((id): id is string => id !== undefined)
      );
      const withoutReplacedTiles = this.removeTiles(this.array, replacedIds);

      if (this.countTiles(withoutReplacedTiles) + this.getTiles(candidate).length <= maximum) {
        this.array = [...withoutReplacedTiles, candidate];
      }
    }
  }

  numTiles(): number {
    return this.countTiles(this.array);
  }

  flatten(): Tile3D[] {
    return this.array.flatMap((element) => this.getTiles(element));
  }

  forEach(callback: (tile: Tile3D) => void): void {
    this.flatten().forEach(callback);
  }

  spliceHighestPriorityTileOrGroup(): TileOrGroup | undefined {
    let priority = Number.MAX_VALUE;
    let index = -1;
    for (let i = 0; i < this.array.length; i++) {
      if (this.array[i]._displayPriority < priority) {
        priority = this.array[i]._displayPriority;
        index = i;
      }
    }
    return index === -1 ? undefined : this.array.splice(index, 1)[0];
  }

  spliceHighestPriorityTilesOrGroups(maxNumTiles: number): GroupedTilesArray {
    const selected = new GroupedTilesArray();
    selected.addTilesOrGroups(new GroupedTilesArray(this.array), maxNumTiles);
    const selectedIds = new Set(selected.flatten().map((tile) => tile.id));
    this.array = this.removeTiles(this.array, selectedIds);
    return selected;
  }

  private countTiles(entries: TileOrGroup[]): number {
    return entries.reduce((count, entry) => count + this.getTiles(entry).length, 0);
  }

  private getTiles(entry: TileOrGroup): Tile3D[] {
    return entry instanceof Tile3D ? [entry] : entry.tiles;
  }

  private removeTiles(entries: TileOrGroup[], tileIds: Set<string>): TileOrGroup[] {
    if (tileIds.size === 0) {
      return entries;
    }
    return entries.flatMap<TileOrGroup>((entry) => {
      if (entry instanceof Tile3D) {
        return tileIds.has(entry.id) ? [] : [entry];
      }
      const remainingTiles = entry.tiles.filter((tile) => !tileIds.has(tile.id));
      if (remainingTiles.length === 0) {
        return [];
      }
      if (remainingTiles.length === entry.tiles.length) {
        return [entry];
      }
      const group = new TileGroup3D();
      remainingTiles.forEach((tile) => group.addTile(tile));
      return [group];
    });
  }
}
