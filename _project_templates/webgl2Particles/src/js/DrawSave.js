import alfrid, { GL } from "alfrid";
import Config from "./Config";
import { random } from "randomUtils";

import vsSave from "shaders/save.vert";
import fsSave from "shaders/save.frag";

class DrawSave extends alfrid.Draw {
  constructor() {
    super();
    const { numParticles } = Config;

    const mesh = new alfrid.Mesh(GL.POINTS);
    const positions = [];
    const uvs = [];
    const normals = [];
    const indices = [];
    let index = 0;

    const m = mat4.create();

    const getRandomPos = () => {
      const r = Math.sqrt(Math.random());
      const v = vec3.fromValues(r, 0, 0);
      mat4.identity(m, m);
      mat4.rotateY(m, m, random(Math.PI * 2));
      mat4.rotateZ(m, m, random(Math.PI * 2));
      vec3.transformMat4(v, v, m);
      return v;
    };

    for (let i = 0; i < numParticles; i++) {
      for (let j = 0; j < numParticles; j++) {
        positions.push(getRandomPos());
        normals.push([random(1), random(1), random(1)]);
        uvs.push([(i / numParticles) * 2 - 1, (j / numParticles) * 2 - 1]);
        indices.push(index);
        index++;
      }
    }

    mesh
      .bufferVertex(positions)
      .bufferNormal(normals)
      .bufferTexCoord(uvs)
      .bufferIndex(indices);

    this.setMesh(mesh)
      .useProgram(vsSave, fsSave)
      .setClearColor(0, 0, 0, 1);
  }
}

export default DrawSave;
