import { mkdir, writeFile } from 'node:fs/promises';
import { makeAudioFixture } from './media.js';

export default async function setup() {
  await mkdir('.local', { recursive: true });
  await writeFile('.local/test-audio.mp3', makeAudioFixture());
}
