import CanvasComponent from "./atoms/Canvas.jsx";
import Navbar from "./atoms/Navbar.jsx";
import Demo from "./components/Demo.jsx";
import FabricCanvasComponent from "./components/FabricCanvasComponent.jsx";
import { ImageCaptureProvider } from "./context/ImageCaptureContext.jsx";

function App() {
  return (
    <div>
      <ImageCaptureProvider>
        <Navbar />
      </ImageCaptureProvider>
      {/* <Demo /> */}
      {/* <CanvasComponent /> */}
      {/* <FabricCanvasComponent /> */}
    </div>
  );
}

export default App;
