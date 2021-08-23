window.packr = new msgpackr.Packr({ structuredClone: true });
const C = {
    CONTRACT:'c',
    ACTION:'a',
    INPUT:'i',
    TRANSACTION:'t',
    KEYS:'k',
    SIGNATURE:'s',
    PUBLICKEY:'k'
  };
const verify = (input) => {
    const verified = crypto.verify(
      input[C.TRANSACTION],
      input[C.SIGNATURE],
      input[C.PUBLICKEY]
    );
    if (!verified) throw new Error("could not verify transaction");
    input[TRANSACTION] = packr.unpack(input[TRANSACTION]);
    return input;
};
window.sign = (from) => {
  const tx = {};
  tx[C.ACTION] = from.action;
  tx[C.INPUT] = from.input;
  const keyUint8Array = new Uint8Array(Buffer.from(from.keyPair.secretKey, "hex"));
  const packed = packr.pack(tx);
  const messageUint8 = new Uint8Array(packed);
  const box = nacl.sign(messageUint8, keyUint8Array);
  return box;
};
