import { Vec3 } from "./types/BaseTypes";
import m4, { Matrix4 } from "./utils/m4";

export default class CoreCamera {
  position: Vec3 = new Vec3(0, 40, 0);

  direction: Vec3 = new Vec3(0, 0, -1);

  up: Vec3 = new Vec3(0, 1, 0);

  right: Vec3 = new Vec3(1, 0, 0);

  matrix: Matrix4;

  moveStatus: Set<"left" | "right" | "forward" | "backward"> = new Set();

  heading: number = 0;

  pitch: number = 0;

  roll: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.matrix = m4.translation(
      this.position.x,
      this.position.y,
      this.position.z
    );
    console.log("matrix", this.matrix);

    document.addEventListener("click", () => {
      canvas.requestPointerLock();
    });

    document.addEventListener("mousemove", (e) => {
      // console.log("mousemove", e.movementX, e.movementY);
      this.heading += (e.movementX * Math.PI) / 180;
      this.pitch += (e.movementY * Math.PI) / 180;

      this.pitch = Math.max(-Math.PI, this.heading);
      this.pitch = Math.min(Math.PI, this.heading);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key.toLocaleLowerCase() === "w") {
        this.moveStatus.add("forward");
      } else if (e.key.toLocaleLowerCase() === "a") {
        this.moveStatus.add("left");
      } else if (e.key.toLocaleLowerCase() === "s") {
        this.moveStatus.add("backward");
      } else if (e.key.toLocaleLowerCase() === "d") {
        this.moveStatus.add("right");
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key.toLocaleLowerCase() === "w") {
        this.moveStatus.delete("forward");
      } else if (e.key.toLocaleLowerCase() === "a") {
        this.moveStatus.delete("left");
      } else if (e.key.toLocaleLowerCase() === "s") {
        this.moveStatus.delete("backward");
      } else if (e.key.toLocaleLowerCase() === "d") {
        this.moveStatus.delete("right");
      }
    });

    this.statusFrameCheck();
  }

  statusFrameCheck() {
    setInterval(() => {
      const movement: Vec3 = new Vec3();

      if (this.moveStatus.has("forward")) {
        console.log("w");
        movement.add(this.direction);
      }
      if (this.moveStatus.has("backward")) {
        console.log("s");
        movement.substract(this.direction);
      }
      if (this.moveStatus.has("left")) {
        console.log("a");
        movement.substract(this.right);
      }
      if (this.moveStatus.has("right")) {
        console.log("d");
        movement.add(this.right);
      }

      movement.normalize().multiply(0.6);
      this.position.add(movement);

      this.matrix = m4.translation(this.position.x, this.position.y, this.position.z);
      this.matrix = m4.yRotate(this.matrix, this.heading);
      // this.matrix = m4.xRotate(this.matrix, this.pitch);
    }, 1000 / 60);
  }
}
