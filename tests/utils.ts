import { parseCIDR, fromByteArray } from "ipaddr.js";
import { Prefix } from "../src/prefix";

export function parsePrefix(prefixAsString: string): Prefix {
  const cidr = parseCIDR(prefixAsString);
  return { bytes: cidr[0].toByteArray(), maskLen: cidr[1] };
}

export function stringifyPrefix(prefix: Prefix): string {
  return `${fromByteArray(prefix.bytes).toString()}/${prefix.maskLen}`;
}