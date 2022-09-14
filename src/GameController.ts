import CoreRenderer from "./CoreRenderer";
import { get_cube_mesh } from "./meshs";

export default class GameController {
  renderer: CoreRenderer;

  constructor(id: string) {
    this.renderer = new CoreRenderer(id);
  }

  start() {
    const cube = get_cube_mesh();
    this.renderer.addMeshs(cube);

    this.update();
  }

  update() {
    this.renderer.render();

    requestAnimationFrame(() => this.update());
  }
}
