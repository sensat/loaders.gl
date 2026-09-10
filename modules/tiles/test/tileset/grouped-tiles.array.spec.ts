// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {Tile3D} from '../../src/tileset/tile-3d';
import {TileGroup3D} from '../../src/tileset/tile-group-3d';
import {GroupedTilesArray} from '../../src/tileset/grouped-tiles.array';

function makeTile(id: string, priority: number, replacedTileId?: string): Tile3D {
  const tile = Object.create(Tile3D.prototype) as Tile3D;
  Object.assign(tile, {
    id,
    _displayPriority: priority,
    _replacedTileId: replacedTileId
  });
  return tile;
}

test('GroupedTilesArray#splice keeps replacement groups atomic', (t) => {
  const parent = makeTile('parent', 0);
  const children = new TileGroup3D();
  children.addTile(makeTile('child-a', 1, 'parent'));
  children.addTile(makeTile('child-b', 1, 'parent'));

  const candidates = new GroupedTilesArray([parent, children]);
  const selected = candidates.spliceHighestPriorityTilesOrGroups(2);

  t.deepEqual(
    selected.flatten().map((tile) => tile.id),
    ['child-a', 'child-b'],
    'children replace their parent as one selection unit'
  );
  t.deepEqual(
    candidates.flatten().map((tile) => tile.id),
    ['parent'],
    'the displaced parent remains available to be unselected'
  );
  t.end();
});

test('GroupedTilesArray#splice retains an ancestor when its replacement exceeds the budget', (t) => {
  const parent = makeTile('parent', 0);
  const children = new TileGroup3D();
  children.addTile(makeTile('child-a', 1, 'parent'));
  children.addTile(makeTile('child-b', 1, 'parent'));

  const candidates = new GroupedTilesArray([parent, children]);
  const selected = candidates.spliceHighestPriorityTilesOrGroups(1);

  t.deepEqual(
    selected.flatten().map((tile) => tile.id),
    ['parent'],
    'a partial replacement group never creates a coverage hole'
  );
  t.end();
});
