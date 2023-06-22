export let Encoding = function (Encoding) {
  Encoding[Encoding["PLAIN"] = 0] = "PLAIN";
  Encoding[Encoding["PLAIN_DICTIONARY"] = 2] = "PLAIN_DICTIONARY";
  Encoding[Encoding["RLE"] = 3] = "RLE";
  Encoding[Encoding["BIT_PACKED"] = 4] = "BIT_PACKED";
  Encoding[Encoding["DELTA_BINARY_PACKED"] = 5] = "DELTA_BINARY_PACKED";
  Encoding[Encoding["DELTA_LENGTH_BYTE_ARRAY"] = 6] = "DELTA_LENGTH_BYTE_ARRAY";
  Encoding[Encoding["DELTA_BYTE_ARRAY"] = 7] = "DELTA_BYTE_ARRAY";
  Encoding[Encoding["RLE_DICTIONARY"] = 8] = "RLE_DICTIONARY";
  return Encoding;
}({});
//# sourceMappingURL=Encoding.js.map