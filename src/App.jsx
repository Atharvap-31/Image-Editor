import CanvasComponent from "./atoms/Canvas.jsx";
import Navbar from "./atoms/Navbar.jsx";
import Demo from "./components/Demo.jsx";
import EditorText from "./components/Editor.jsx";
import FabricCanvasComponent from "./components/FabricCanvasComponent.jsx";
import { ImageCaptureProvider } from "./context/ImageCaptureContext.jsx";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/froala_editor.pkgd.min";

function App() {
  return (
    <div>
      <ImageCaptureProvider>
        {" "}
        <Navbar />{" "}
      </ImageCaptureProvider>
      {/* <EditorText /> */}
      {/* <Demo /> */}
      {/* <CanvasComponent /> */}
      {/* <FabricCanvasComponent /> */}
    </div>
  );
}

export default App;
