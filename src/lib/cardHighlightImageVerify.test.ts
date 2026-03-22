import { describe, expect, it } from "vitest";
import { imageBytesLookLikeRaster } from "./cardHighlightImageVerify";

describe("imageBytesLookLikeRaster", () => {
  it("accepts minimal JPEG magic", () => {
    const b = Buffer.alloc(40);
    b[0] = 0xff;
    b[1] = 0xd8;
    b[2] = 0xff;
    expect(imageBytesLookLikeRaster(b)).toBe(true);
  });

  it("rejects HTML/text", () => {
    const b = Buffer.from("<!DOCTYPE html><html>", "utf8");
    expect(imageBytesLookLikeRaster(b)).toBe(false);
  });

  it("accepts ISO BMFF ftyp (AVIF container)", () => {
    const b = Buffer.alloc(40);
    b[4] = 0x66;
    b[5] = 0x74;
    b[6] = 0x79;
    b[7] = 0x70;
    expect(imageBytesLookLikeRaster(b)).toBe(true);
  });
});
