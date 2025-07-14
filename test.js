import fs from 'node:fs';
import path from 'node:path';
import {fileTypeFromBuffer} from 'file-type';
import test from 'ava';
import decompressTarXz from './index.js';

async function isJpg(input) {
	const fileType = await fileTypeFromBuffer(input);
	return fileType.ext === 'jpg';
}

test('extract file', async t => {
	const buf = fs.readFileSync(path.join(import.meta.dirname, 'fixtures/file.tar.xz'));
	const files = await decompressTarXz()(buf);

	t.is(files[0].path, 'test.jpg');
	t.true(await isJpg(files[0].data));
});

test('extract file using streams', async t => {
	const stream = fs.createReadStream(path.join(import.meta.dirname, 'fixtures/file.tar.xz'));
	const files = await decompressTarXz()(stream);

	t.is(files[0].path, 'test.jpg');
	t.true(await isJpg(files[0].data));
});

test('return empty array if non-valid file is supplied', async t => {
	const buf = fs.readFileSync(import.meta.filename);
	const files = await decompressTarXz()(buf);

	t.is(files.length, 0);
});

test('throw on wrong input', async t => {
	await t.throwsAsync(decompressTarXz()('foo'), {message: 'Expected a Buffer or Stream, got string'});
});

test('many parallel decompressions', async t => {
	const stream = fs.createReadStream(path.join(import.meta.dirname, 'fixtures/file.tar.xz'));
	const promises = [];
	for (let i = 0; i < 1000; i++) {
		promises.push(decompressTarXz()(stream));
	}

	const files = await Promise.all(promises);

	const jpgChecks = files.map(file => isJpg(file[0].data));
	const jpgResults = await Promise.all(jpgChecks);

	for (const [i] of files.entries()) {
		t.is(files[i][0].path, 'test.jpg');
		t.true(jpgResults[i]);
	}
});
