import {Buffer} from 'node:buffer';
import {Readable} from 'node:stream';
import {createDecompressStream} from '@napi-rs/lzma/xz';
import decompressTar from '@xhmikosr/decompress-tar';
import {fileTypeFromBuffer} from 'file-type';

const decompressTarXz = () => async input => {
	const isBuffer = Buffer.isBuffer(input);

	if (!isBuffer && !(input instanceof Readable)) {
		throw new TypeError(`Expected a Buffer or Readable stream, got ${typeof input}`);
	}

	if (isBuffer) {
		const type = await fileTypeFromBuffer(input);

		if (!type || type.mime !== 'application/x-xz') {
			return [];
		}
	}

	const decompressor = createDecompressStream();
	const result = decompressTar()(decompressor);

	if (isBuffer) {
		decompressor.end(input);
	} else {
		input.pipe(decompressor);
	}

	return result;
};

export default decompressTarXz;
