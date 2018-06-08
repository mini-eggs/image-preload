# image-preload

Simple, framework-agnostic image preloader. Async, sync, background, foreground, whatever!

#### Installation

```bash
npm install --save image-preload
```

Or you can use a browser script available from `https://unpkg.com/image-preload@1.0.6/browser/main.js`.

##### Minimal usage

```javascript
import Preload from "image-preload";

Preload(["https://i.imgur.com/VCr4saa.png"]);
```

#### Async, in background usage

```javascript
import Preload from "image-preload";

Preload(["https://i.imgur.com/VCr4saa.png"], {
  inBackground: true,
  toBase64: true,
  onSingleImageComplete: base64 => console.log(base64)
});
```

#### Sorting options usage

```javascript
import Preload, { Order } from "image-preload";

Preload(["https://i.imgur.com/VCr4saa.png"], { order: Order.AllAtOnce });
// or
Preload(["https://i.imgur.com/VCr4saa.png"], { order: Order.InOrder });
```

#### All options

```typescript
type Options = {
  order?: Order;
  timeout?: number;
  shouldContinueOnFail?: boolean;
  toBase64?: boolean;
  inBackground?: boolean;
  onSingleImageFail?: Function;
  onSingleImageComplete?: Function;
  onComplete?: Function;
};
```

#### Defaul options

```javascript
const defaultOptions = {
  order: Order.InOrder,
  timeout: 0,
  shouldContinueOnFail: true,
  toBase64: false,
  inBackground: false,
  onSingleImageFail: () => {},
  onSingleImageComplete: () => {},
  onComplete: () => {}
};
```
