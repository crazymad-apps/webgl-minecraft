export interface BaseMesh {
  vertexs: number[];
  indices: number[];
  normals: number[];
}

export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x?: number, y?: number, z?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }

  add(v3: Vec3) {
    this.x += v3.x;
    this.y += v3.y;
    this.z += v3.z;
    return this;
  }

  substract(v3: Vec3) {
    this.x -= v3.x;
    this.y -= v3.y;
    this.z -= v3.z;
    return this;
  }

  normalize() {
    const len_2 = Math.sqrt(
      Math.pow(this.x, 2) * Math.pow(this.y, 2) * Math.pow(this.z, 2)
    );
    if (len_2 === 0) return this;

    const scale = 1 / len_2;
    this.multiply(scale);
    return this;
  }

  multiply(value: number) {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return this;
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }
}
