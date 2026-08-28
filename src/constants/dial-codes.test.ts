import { describe, expect, it } from "vitest";
import {
  DEFAULT_DIAL_ISO,
  DIAL_CODES,
  joinDialCode,
  splitDialCode,
} from "./dial-codes";

describe("dial codes", () => {
  it("gives every entry a well-formed ISO code and dial code", () => {
    for (const entry of DIAL_CODES) {
      expect(entry.iso, `${entry.iso} is not a 2-letter ISO code`).toMatch(
        /^[A-Z]{2}$/,
      );
      expect(entry.dial, `${entry.iso} has a malformed dial code`).toMatch(
        /^\+\d{1,4}$/,
      );
    }
  });

  it("lists no country twice", () => {
    const isos = DIAL_CODES.map((entry) => entry.iso);
    expect(new Set(isos).size).toBe(isos.length);
  });

  it("names every country the runtime can, in both languages", () => {
    /*
      The picker's labels come from `Intl.DisplayNames` rather than a
      translated table. That is only safe while the runtime actually knows
      every code in the list: an unknown one falls back to the raw ISO code,
      which reads as a bug to a visitor scanning for their country.
    */
    for (const locale of ["de", "en"]) {
      const names = new Intl.DisplayNames([locale], { type: "region" });
      for (const entry of DIAL_CODES) {
        const name = names.of(entry.iso);
        expect(name, `${entry.iso} has no ${locale} name`).toBeTruthy();
        expect(
          name,
          `${entry.iso} resolved to its own code in ${locale}`,
        ).not.toBe(entry.iso);
      }
    }
  });

  it("keeps the studio's own country in the list, and first", () => {
    expect(DIAL_CODES[0].iso).toBe(DEFAULT_DIAL_ISO);
  });

  it("round-trips a number through split and join", () => {
    for (const entry of DIAL_CODES) {
      const joined = joinDialCode(entry.iso, "151 23456789");
      const split = splitDialCode(joined);
      expect(split.nationalNumber).toBe("151 23456789");
      /*
        Not the ISO code itself: the US and Canada share `+1`, so a stored
        number cannot say which of the two it came from. The DIAL is what has
        to survive the trip.
      */
      const resolved = DIAL_CODES.find((item) => item.iso === split.iso);
      expect(resolved?.dial).toBe(entry.dial);
    }
  });

  it("matches the LONGEST dial code, not the first one that fits", () => {
    /*
      The bug this prevents: `+4` is a prefix shared by Germany, Austria and
      the UK, so a shortest-first match turns a saved `+44 20 7946 0958` into
      Germany with a national number of `4 20 7946 0958`. A visitor's own
      number comes back mangled, from their own saved draft.
    */
    expect(splitDialCode("+44 20 7946 0958")).toEqual({
      iso: "GB",
      nationalNumber: "20 7946 0958",
    });
    expect(splitDialCode("+49 151 23456789")).toEqual({
      iso: "DE",
      nationalNumber: "151 23456789",
    });
    expect(splitDialCode("+43 664 1234567")).toEqual({
      iso: "AT",
      nationalNumber: "664 1234567",
    });
    // +35 is a prefix of +351 and +353; neither may swallow the other.
    expect(splitDialCode("+351 912 345 678").iso).toBe("PT");
    expect(splitDialCode("+353 85 123 4567").iso).toBe("IE");
  });

  it("falls back to the default country for a number with no dial code", () => {
    expect(splitDialCode("0151 23456789")).toEqual({
      iso: DEFAULT_DIAL_ISO,
      nationalNumber: "0151 23456789",
    });
  });

  it("stays empty when there is no number, rather than sending a bare +49", () => {
    /*
      The field is optional. Joining a country onto an empty number would send
      "+49" as the visitor's phone number, which is not a phone number and is
      indistinguishable from one at the receiving end.
    */
    expect(joinDialCode("DE", "")).toBe("");
    expect(joinDialCode("DE", "   ")).toBe("");
  });
});
