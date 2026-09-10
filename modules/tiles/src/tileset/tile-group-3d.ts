// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {Tile3D} from './tile-3d';

export class TileGroup3D {
  _displayPriority = Number.MAX_VALUE;
  tiles: Tile3D[] = [];

  addTile(tile: Tile3D): void {
    this.tiles.push(tile);
    this._displayPriority = Math.min(this._displayPriority, tile._displayPriority);
  }
}
