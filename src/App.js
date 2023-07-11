import { useState, useEffect } from "react";
import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import axios from "axios";

// Components
import Spinner from "react-bootstrap/Spinner";
import Navigation from "./components/Navigation";

// ABIs
import NFT from "./abis/NFT.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    createImage();
  };

  const createImage = async () => {
    console.log("creating image...");

    const URL =
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";

    axios({
      url: URL,
      method: "POST",
      headers: {
        Autorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        inputs: description,
        options: { wait_for_model: true },
      }),
      responseType: "arraybuffer",
    });

    const type = response.headers["content-type"];
    const data = response.data;

    const base64data = Buffer.from(data).toString("base64");
    const img = `data:${type};base64,` + base64data;
    setImage(img);

    return data;
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <div className="form">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Create a name..."
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
          <input
            type="text"
            placeholder="Create a description..."
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></input>
          <input type="submit" value="Create and Mint"></input>
        </form>
        <div className="image">
          <img src={image} alt="Ai generated images" />
        </div>
      </div>
      <p>
        {" "}
        View&nbsp;
        <a href="" target="_blank" rel="noreferrer">
          Metadata
        </a>
      </p>
    </div>
  );
}

export default App;
