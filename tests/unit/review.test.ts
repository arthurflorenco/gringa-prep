import { describe, expect, it } from "vitest";
import { gradeReview } from "@/lib/grading/review";
import { Rating } from "@/lib/srs";

describe("review grading", () => {
  it("rewards finding every issue", () => {
    const g = gradeReview([3, 7], [3, 7]);
    expect(g.score).toBe(1);
    expect(g.rating).toBe(Rating.Easy);
    expect(g.missed).toEqual([]);
  });
  it("penalizes false positives and reports misses", () => {
    const g = gradeReview([3, 5, 9], [3, 7]);
    expect(g.found).toEqual([3]);
    expect(g.missed).toEqual([7]);
    expect(g.falsePositives).toEqual([5, 9]);
    expect(g.score).toBe(0);
    expect(g.rating).toBe(Rating.Again);
  });
  it("marking every line is not a strategy", () => {
    expect(gradeReview([1, 2, 3, 4, 5, 6, 7, 8], [3, 7]).score).toBe(0);
  });
});
