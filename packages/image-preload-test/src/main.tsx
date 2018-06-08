import * as React from "react";
import { render } from "react-dom";

import Preload, { Order } from "image-preload";

/**
 * App test props
 */

const images = [
  "https://images.unsplash.com/photo-1491719302159-fcdf021abd5c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=edec06b3daef51c2ad631da14044445e&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1496298193381-ab73cad974b3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c5edcb7455bff5b6df32e0a3a3ff1ff8&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1503582782712-e90ad6f764b5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8d9890d1ffc4d0c80792fd82829ca287&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e9ae10b6e8d0e8a990d41c7aafd13a78&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1508857422602-76c8c01b5c89?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ef7863bfdd3c23df7c9f7ef636819b22&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1517257318138-4cf97d9a2d82?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c124fa41a83d7ccdac37071a3f71aa28&auto=format&fit=crop&w=500&q=60"
];

/**
 * Styles
 */

type styleMap = {
  [key: string]: {
    [key: string]: number | string;
  };
};

const styles: styleMap = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
    overflow: "hidden"
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain"
  },
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    textAlign: "center"
  },
  actionButton: {
    minWidth: "100px",
    margin: "15px",
    padding: "15px",
    fontSize: "18px"
  }
};

/**
 * App
 */

interface AppProps {
  images: Array<string>;
}

interface AppState {
  index: number;
  images: Array<string>;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.renderImage = this.renderImage.bind(this);
    this.renderActions = this.renderActions.bind(this);

    this.state = { index: 0, images: [] };
  }

  componentDidMount() {
    Preload(this.props.images, {
      inBackground: true,
      toBase64: true,
      order: Order.AllAtOnce,
      onSingleImageComplete: (base64: string) => {
        this.setState(({ images }) => ({ images: [...images, base64] }));
      }
    });
  }

  changeDirection(dir: number) {
    return () => {
      const index = this.state.index + dir;
      const next = this.state.images[index];

      if (!next) {
        return;
      }

      this.setState(() => ({ index }));
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <this.renderImage />
        <this.renderActions />
      </div>
    );
  }

  renderImage() {
    return <img src={this.state.images[this.state.index]} style={styles.image} />;
  }

  renderActions() {
    return (
      <div style={styles.actionContainer}>
        <button onClick={this.changeDirection(-1)} style={styles.actionButton}>
          previous
        </button>
        <button onClick={this.changeDirection(1)} style={styles.actionButton}>
          next
        </button>
      </div>
    );
  }
}

/**
 * Startup
 */

render(<App images={images} />, document.getElementById("root"));
