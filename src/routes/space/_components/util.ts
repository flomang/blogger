export function clamp(input: number, min: number, max: number): number {
  return input < min ? min : input > max ? max : input;
}

export function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
  const mapped: number = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  let dx = x2 - x1;
  let dy = y2 - y1;

  return Math.sqrt((dx * dx) + (dy * dy));
}

export function pointCircle(px: number, py: number, cx: number, cy: number, r: number): boolean {
  let dist = distance(px, py, cx, cy);
  if (dist <= r) {
    return true;
  }
  return false;
}

export function linePoint(x1: number, y1: number, x2: number, y2: number, px: number, py: number): boolean {
  let d1 = distance(px, py, x1, y1);
  let d2 = distance(px, py, x2, y2);
  let lineLen = distance(x1, y1, x2, y2);
  let buffer = 0.1

  // if the two distances are equal to the line's
  // length, the point is on the line!
  // note we use the buffer here to give a range, rather
  // than one #
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }
  return false;
}

export function lineCircle(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, r: number): boolean {
  let inside1 = pointCircle(x1, y1, cx, cy, r);
  let inside2 = pointCircle(x2, y2, cx, cy, r);
  if (inside1 || inside2) return true;

  let dx = x1 - x2;
  let dy = y1 - y2;
  let len = Math.sqrt((dx * dx) + (dy * dy));

  let dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(len, 2);

  let closestX = x1 + (dot * (x2 - x1));
  let closestY = y1 + (dot * (y2 - y1));

  let onSegment = linePoint(x1, y1, x2, y2, closestX, closestY);
  if (!onSegment) return false;

  let dist = distance(cx, cy, closestX, closestY)
  if (dist <= r) {
    return true;
  }
  return false;
}

export function polyCircle(vertices: number[], cx: number, cy: number, r: number): boolean {
  let next = 0;
  for (let current = 0; current < vertices.length; current+=2) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = (current + 2);
    if (next == vertices.length) next = 0;

    let v1x = vertices[current];    // c for "current"
    let v1y = vertices[current + 1];       // n for "next"
    let v2x = vertices[next];       // n for "next"
    let v2y = vertices[next + 1];       // n for "next"

    // check for collision between the circle and
    // a line formed between the two vertices
    let collision = lineCircle(v1x, v1y, v2x, v2y, cx, cy, r);
    if (collision) return true;
  }
  return false;
}