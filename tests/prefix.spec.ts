import { isPrefixContain, Prefix } from "../src/prefix";
import { parsePrefix } from "./utils";

describe('Prefix Containment', () => {
  test('IPv4 prefix containment', () => {
    const parent: Prefix = parsePrefix("192.168.0.0/16");
    const child: Prefix = parsePrefix("192.168.1.0/24");
    expect(isPrefixContain(parent, child)).toBe(true);
  });

  test('IPv4 non-containment', () => {
    const parent: Prefix = parsePrefix("192.168.0.0/24");
    const child: Prefix = parsePrefix("192.168.1.0/24");
    expect(isPrefixContain(parent, child)).toBe(false);
  });

  test('IPv4 prefix longer than child prefix', () => {
    const parent: Prefix = parsePrefix("192.168.1.0/24");
    const child: Prefix = parsePrefix("192.168.1.0/16");
    expect(isPrefixContain(parent, child)).toBe(false);
  });

  test('IPv6 prefix containment', () => {
    const parent: Prefix = parsePrefix("2001:db8::/32");
    const child: Prefix = parsePrefix("2001:db8:0:1::/64");
    expect(isPrefixContain(parent, child)).toBe(true);
  });

  test('IPv6 non-containment', () => {
    const parent: Prefix = parsePrefix("2001:db8::/64");
    const child: Prefix = parsePrefix("2001:db9::/64");
    expect(isPrefixContain(parent, child)).toBe(false);
  });

  test('IPv6 prefix longer than child prefix', () => {
    const parent: Prefix = parsePrefix("2001:db8:0:1::/64");
    const child: Prefix = parsePrefix("2001:db8::/32");
    expect(isPrefixContain(parent, child)).toBe(false);
  });
});
