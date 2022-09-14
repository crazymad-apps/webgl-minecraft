import { BaseMesh } from "./types/BaseTypes";
import { coord_plus } from "./utils/coordinates";

/**
 * cube vertexs
 *     4 ____________5
 *    /|            /|
 *   0____________1  |
 *   | |          |  |
 *   | 7_ _ _ _ _ |_ 6
 *   |/           | /
 *   3____________2
 */
export function get_cube_mesh(
  offset: [number, number, number] = [0.0, 0.0, 0.0]
): BaseMesh {
  const a1 = [-0.5, 0.5, 0.5];
  const b1 = [0.5, 0.5, 0.5];
  const c1 = [0.5, -0.5, 0.5];
  const d1 = [-0.5, -0.5, 0.5];

  const a2 = [-0.5, 0.5, -0.5];
  const b2 = [0.5, 0.5, -0.5];
  const c2 = [0.5, -0.5, -0.5];
  const d2 = [-0.5, -0.5, -0.5];

  const vertexs = [a1, b1, c1, d1, a2, b2, c2, d2]
    .map((coord: [number, number, number]) => coord_plus(coord, offset))
    .reduce((coords: number[], coord: [number, number, number]) => {
      return coords.concat(coord);
    }, []);

  // [front, left, top, right, back, bottom]
  const indices = [
    0,
    1,
    2, //  front side
    2,
    3,
    0, // front side
    0,
    3,
    7, // left side
    7,
    4,
    0, // left side
    0,
    1,
    4, // top side
    4,
    1,
    5, // top side
    5,
    6,
    2, // right side
    2,
    1,
    6, // right side
    6,
    5,
    4, // back side
    4,
    7,
    6, // backside
    6,
    7,
    2, // bottom side
    2,
    7,
    3, // bottom side
  ];

  return {
    vertexs,
    indices,
  };
}
