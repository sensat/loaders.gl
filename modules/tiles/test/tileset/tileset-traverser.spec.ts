import test from 'tape-promise/tape';
import {WebMercatorViewport} from '@deck.gl/core';
import {load} from '@sensat/loaders-gl-core';
import {Tiles3DLoader} from '@sensat/loaders-gl-3d-tiles';
import {Tileset3D} from '@sensat/loaders-gl-tiles';

import {TilesetTraverser} from '../../src/tileset/tileset-traverser';
import {getFrameState} from '../../src/tileset/helpers/frame-state';
import {TILE_REFINEMENT} from '../../src/constants';

// Parent tile with content and four child tiles with content
const TILESET_URL = '@sensat/loaders-gl-3d-tiles/test/data/CesiumJS/Tilesets/Tileset/tileset.json';

test('Tileset3D#traverser base class', async (t) => {
  const tilesetJson = await load(TILESET_URL, Tiles3DLoader);
  if (tilesetJson.shape !== 'tileset3d') {
    t.fail('tileset');
    t.end();
    return;
  }

  // Create Tileset3D to have initialized Tile3Ds tree
  const tileset = new Tileset3D(tilesetJson);

  const traverser = new TilesetTraverser({
    basePath: tilesetJson.basePath,
    onTraversalEnd: traversalEnd
  });

  const viewport = new WebMercatorViewport({
    altitude: 1.5,
    bearing: 0,
    far: 1000,
    fovy: 50,
    height: 600,
    id: 'view0',
    latitude: 40.049483884253355,
    longitude: -75.60783109310839,
    maxPitch: 85,
    maxZoom: 30,
    minPitch: 0,
    minZoom: 2,
    modelMatrix: null,
    near: 0.1,
    pitch: 45,
    projectionMatrix: null,
    width: 1848,
    zoom: 12.660812211760435
  });
  traverser.traverse(tileset.root, getFrameState(viewport, 0), {});
  function traversalEnd() {
    t.ok(traverser);
    t.end();
  }
});

test('TilesetTraverser#touchTile updates display priority once per frame', (t) => {
  let priorityCalls = 0;
  const tile = {
    tileset: {_cache: {touch: () => {}}},
    _displayPriority: 0,
    _touchedFrame: 0,
    _getDisplayPriority: () => {
      priorityCalls++;
      return 42;
    }
  };
  const traverser = new TilesetTraverser({});
  const frameState = {frameNumber: 1};

  traverser.touchTile(tile as Tile3D, frameState as any);
  traverser.touchTile(tile as Tile3D, frameState as any);

  t.equal(tile._displayPriority, 42, 'uses the tile display priority');
  t.equal(priorityCalls, 1, 'does not recompute it in the same frame');
  t.end();
});

test('TilesetTraverser#loadTile preserves an empty root ID for replacement grouping', (t) => {
  const tile = {
    parent: {refine: TILE_REFINEMENT.REPLACE, id: ''},
    tileset: {url: 'https://example.tld/tileset.json'},
    _replacedTileId: undefined
  };
  const traverser = new TilesetTraverser({});

  traverser.loadTile(tile as Tile3D, {frameNumber: 1} as any);

  t.equal(tile._replacedTileId, '', 'does not replace a defined root ID with the tileset URL');
  t.end();
});
