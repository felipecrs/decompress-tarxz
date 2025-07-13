import {Buffer} from 'node:buffer';
import {Readable} from 'node:stream';
import decompressTar from '@xhmikosr/decompress-tar';
import {fileTypeFromBuffer} from 'file-type';
import {isStream} from 'is-stream';
import xzDecompress from 'xz-decompress';

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

	// Create a web stream from the input
	const inputWebStream = isBuffer
		? new ReadableStream({
			start(controller) {
				controller.enqueue(input);
				controller.close();
			},
		})
		: Readable.toWeb(input);

	// Create the XZ decompression stream
	const xzStream = new xzDecompress.XzReadableStream(inputWebStream);

	// Convert back to Node.js stream for decompress-tar
	const nodeStream = Readable.fromWeb(xzStream);

	// Use decompress-tar with the decompressed stream
	return decompressTar()(nodeStream);
};

export default decompressTarXz;
