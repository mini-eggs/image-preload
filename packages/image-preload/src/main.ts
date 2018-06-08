import Greenlet from "greenlet";

enum Order {
  AllAtOnce,
  InOrder
}

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

type FullOptions = {
  order: Order;
  timeout: number;
  shouldContinueOnFail: boolean;
  toBase64: boolean;
  inBackground: boolean;
  onSingleImageFail: Function;
  onSingleImageComplete: Function;
  onComplete: Function;
};

const defaultOptions: FullOptions = {
  order: Order.InOrder,
  timeout: 0,
  shouldContinueOnFail: true,
  toBase64: false,
  inBackground: false,
  onSingleImageFail: () => {},
  onSingleImageComplete: () => {},
  onComplete: () => {}
};

function sleep(t: number) {
  return new Promise(resolve => setTimeout(resolve, t));
}

async function Preload(images: Array<string>, userProvidedOptions?: Options) {
  const options: FullOptions = { ...defaultOptions, ...(userProvidedOptions || {}) };

  if (options.timeout && options.order === Order.AllAtOnce) {
    throw new Error("Invalid options: Cannot specify `timeout` options and `AllAtOnce` order.");
  }

  if (options.toBase64 === false && options.inBackground === true) {
    throw new Error("Invalid options: If `inBackground` options is true `toBase64` options must be true as well.");
  }

  if (options.toBase64 === true && options.inBackground === false) {
    throw new Error("Invalid options: If `inBackground` options is false `toBase64` options must be false as well.");
  }

  function loadInDom(x: string) {
    return new Promise((resolve, reject) => {
      const el = document.createElement("img");
      el.setAttribute("src", x);
      el.addEventListener("load", e => {
        options.onSingleImageComplete(e);
        resolve(e);
      });
      el.addEventListener("error", e => {
        options.onSingleImageFail(e);
        reject(e);
      });
    });
  }

  async function load(x: string) {
    if (options.inBackground) {
      const fn = Greenlet(y => {
        return new Promise((resolve, reject) => {
          const req = new XMLHttpRequest();
          req.open("GET", y);
          req.responseType = "blob";
          req.send();
          req.addEventListener("load", () => {
            const reader = new FileReader();
            reader.readAsDataURL(req.response);
            reader.addEventListener("loadend", () => {
              resolve(reader.result);
            });
          });
          req.addEventListener("error", e => {
            reject(e);
          });
        });
      });

      try {
        return options.onSingleImageComplete(await fn(x));
      } catch (e) {
        options.onSingleImageFail(e);
        throw new Error(e);
      }
    }

    return await loadInDom(x);
  }

  if (options.order === Order.AllAtOnce) {
    await Promise.all(images.map(load));
  }

  if (options.order === Order.InOrder) {
    for (let single of images) {
      try {
        await sleep(options.timeout);
        await load(single);
      } catch (e) {
        if (!options.shouldContinueOnFail) {
          throw new Error(e);
        }
      }
    }
  }

  options.onComplete();
}

export { Order };

export default Preload;
