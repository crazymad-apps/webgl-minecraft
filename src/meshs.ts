import { BaseMesh } from "./types/BaseTypes";
import { coord_plus } from "./utils/coordinates";

/**
 * cube vertexs
 *     4 ____________5
 *    /|            /|
 *   0____________1  |
 *   | |          |  |
 *   | |          |  |
 *   | 7_ _ _ _ _ |_ 6
 *   |/           | /
 *   3____________2
 */
export function get_cube_mesh(
  offset: [number, number, number] = [0.0, 0.0, 0.0]
): BaseMesh {
  const a1 = [-10, 10, 10];
  const b1 = [10, 10, 10];
  const c1 = [10, -10, 10];
  const d1 = [-10, -10, 10];

  const a2 = [-10, 10, -10];
  const b2 = [10, 10, -10];
  const c2 = [10, -10, -10];
  const d2 = [-10, -10, -10];

  const vertexs = [a1, b1, c1, d1, a2, b2, c2, d2]
    .map((coord: [number, number, number]) => coord_plus(coord, offset))
    .reduce((coords: number[], coord: [number, number, number]) => {
      return coords.concat(coord);
    }, []);

  // [front, left, top, right, back, bottom]
  // prettier-ignore
  const indices = [
    0, 1, 2, // front side
    2, 3, 0, // front side
    0, 3, 7, // left side
    7, 4, 0, // left side
    0, 4, 1, // top side
    1, 4, 5, // top side
    5, 6, 2, // right side
    2, 1, 5, // right side
    5, 4, 6,// back side
    6, 4, 7, // backside
    7, 3, 2, // bottom side
    2, 6, 7, // bottom side
  ];

  // prettier-ignore
  const normals = [
    0, 0, 1, // front side
    0, 0, 1, // front size
    0, -1, 0, // left side
    0, -1, 0, // left side
    1, 0, 0, // top side
    1, 0, 0, // top side
    0, 1, 0, // right side
    0, 1, 0, // right side
    0, 0, -1, // back side
    0, 0, -1, // back side
    -1, 0, 0, // bottom side
    -1, 0, 0, // bittom side
  ]

  return {
    vertexs,
    indices,
    normals,
  };
}
