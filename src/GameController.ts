import CoreRenderer from "./CoreRenderer";
import { get_cube_mesh } from "./meshs";

export default class GameController {
  renderer: CoreRenderer;

  latest_frame_time: number = new Date().getTime();

  constructor(id: string) {
    this.renderer = new CoreRenderer(id);
  }

  start() {
    this.renderer.addMeshs(get_cube_mesh([-60, 0, 0]));
    this.renderer.addMeshs(get_cube_mesh([-30, 0, 0]));
    this.renderer.addMeshs(get_cube_mesh([0, 0, 0]));
    this.renderer.addMeshs(get_cube_mesh([30, 0, 0]));
    this.renderer.addMeshs(get_cube_mesh([60, 0, 0]));

    this.update();
  }

  update() {
    this.renderer.render();
    const end_time = new Date().getTime();
    const duration = end_time - this.latest_frame_time;
    const frame_value_dom = document.getElementById("frame-value");
    this.latest_frame_time = end_time;

    if (frame_value_dom) {
      frame_value_dom.innerText = (1000 / duration).toFixed(2).toString();
    }

    requestAnimationFrame(() => this.update());
  }
}
