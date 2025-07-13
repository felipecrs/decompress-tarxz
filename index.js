import {Buffer} from 'node:buffer';
import decompressTar from '@xhmikosr/decompress-tar';
import {fileTypeFromBuffer} from 'file-type';
import {isStream} from 'is-stream';
import lzmaNative from 'lzma-native';

const decompressTarXz = () => async input => {
	const isBuffer = Buffer.isBuffer(input);

	if (!isBuffer && !isStream(input)) {
		throw new TypeError(`Expected a Buffer or Stream, got ${typeof input}`);
	}

	if (isBuffer) {
		const type = await fileTypeFromBuffer(input);

		if (!type || type.ext !== 'xz') {
			return [];
		}
	}

	const decompressor = lzmaNative.createDecompressor();
	const result = decompressTar()(decompressor);

	if (isBuffer) {
		decompressor.end(input);
	} else {
		input.pipe(decompressor);
	}

	return result;
};

export default decompressTarXz;
