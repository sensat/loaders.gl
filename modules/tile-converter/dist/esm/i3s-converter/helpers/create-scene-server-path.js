import { v4 as uuidv4 } from 'uuid';
import transform from 'json-map-transform';
import { join } from 'path';
import { SCENE_SERVER as sceneServerTemplate } from '../json-templates/scene-server';
import { writeFile } from '../../lib/utils/file-utils';
export async function createSceneServerPath(layerName, layers0, rootPath) {
  const sceneServerData = {
    serviceItemId: uuidv4().replace(/-/gi, ''),
    layerName,
    layers0
  };
  const sceneServer = transform(sceneServerData, sceneServerTemplate());
  const nodePagePath = join(rootPath, 'SceneServer');
  await writeFile(nodePagePath, JSON.stringify(sceneServer));
}
//# sourceMappingURL=create-scene-server-path.js.map