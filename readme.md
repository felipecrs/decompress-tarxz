# @felipecrs/decompress-tarxz

> tar.xz decompress plugin

## Install

```console
npm install @felipecrs/decompress-tarxz
```

## Usage

```js
import decompress from '@xhmikosr/decompress';
import decompressTarXz from '@felipecrs/decompress-tarxz';

await decompress('unicorn.tar.xz', 'dist', {
  plugins: [
    decompressTarXz()
  ]
});

console.log('Files decompressed');
```

## API

### decompressTarxz()(input)

Returns both a `Promise<Buffer>` and a [Duplex stream](https://nodejs.org/api/stream.html#stream_class_stream_duplex).

#### input

Type: `Buffer` `Stream`

Buffer or Stream to decompress.
