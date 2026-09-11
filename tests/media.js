import { Mp3Encoder } from '@breezystack/lamejs';

export function makeAudioFixture() {
  const sampleRate = 22050;
  const encoder = new Mp3Encoder(1, sampleRate, 64);
  const samples = new Int16Array(sampleRate * 12);
  const chunks = [];
  for (let offset = 0; offset < samples.length; offset += 1152) {
    chunks.push(Buffer.from(encoder.encodeBuffer(samples.subarray(offset, offset + 1152))));
  }
  chunks.push(Buffer.from(encoder.flush()));
  return Buffer.concat(chunks);
}
