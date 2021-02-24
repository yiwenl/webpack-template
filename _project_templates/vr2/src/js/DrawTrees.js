import { Draw, Geom } from "alfrid";

import Config from "./Config";
import { random } from "randomutils";

import vs from "shaders/trees.vert";
import fs from "shaders/trees.frag";

class DrawTrees extends Draw {
  constructor() {
    super();

    const num = 10;
    const mesh = Geom.plane(1, 1, num);

    const { numTrees, envSize } = Config;
    const posOffsets = [];
    const extras = [];
    let i = numTrees;

    function getPos() {
      return [random(-envSize, envSize), random(1), random(-envSize, envSize)];
    }

    while (i--) {
      posOffsets.push(getPos());
      extras.push([random(1), random(1), random(1)]);
    }

    mesh.bufferInstance(posOffsets, "aPosOffset");
    mesh.bufferInstance(extras, "aExtra");

    this.setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uEnvSize", envSize);
  }
}

export default DrawTrees;
