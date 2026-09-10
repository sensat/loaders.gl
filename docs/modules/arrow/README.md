# Overview

![arrow-logo](./images/apache-arrow-small.png)
&emsp;
![apache-logo](../../images/logos/apache-logo.png)

The `@sensat/loaders-gl-arrow` module provides support for the [Apache Arrow](/docs/modules/arrow/formats/arrow) and [GeoArrow](/docs/modules/arrow/formats/geoarrow) formats.

## Installation

```bash
npm install @sensat/loaders-gl-core @sensat/loaders-gl-arrow
```

See [Using with Apache Arrow](/docs/developer-guide/apache-arrow) for practical guidance on how to integrate with the Apache Arrow JS library.

## Loaders and Writers

| Loader                                                                |
| --------------------------------------------------------------------- |
| [`ArrowLoader`](/docs/modules/arrow/api-reference/arrow-loader)       |
| [`ArrowWorkerLoader`](/docs/modules/arrow/api-reference/arrow-loader) |
| [`GeoArrowLoader`](/docs/modules/arrow/api-reference/geoarrow-loader) |

| Writer                                                          |
| --------------------------------------------------------------- |
| [`ArrowWriter`](/docs/modules/arrow/api-reference/arrow-writer) |

## Additional APIs

Arrow provides a rich JavaScript API for working with Arrow formatted data.
Start with the [`ArrowJS API Reference`](/docs/arrowjs/api-reference).

## Attributions

`@sensat/loaders-gl-arrow` was developed with the benefit of extensive technical advice from Paul Taylor @ Graphistry.
