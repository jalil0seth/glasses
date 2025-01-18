import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { ZoomIn, ZoomOut, MoveHorizontal, MoveVertical, RotateCcw, RotateCw, Glasses, ChevronLeft, ChevronRight, Upload } from 'lucide-react';

const DEFAULT_GLASSES_STYLES = [
  {
    id: 'blue-frame',
    name: 'Blue Frame',
    url: 'https://www.kp2020.org/images/frames-blue.svg'
  },
  {
    id: 'finley-red',
    name: 'Finley Red',
    url: 'https://cdn.shopify.com/s/files/1/1147/9910/products/FINLEY_RED_21_SOLIDCLASSIC_3D_e3a5e7fa-872c-4ec7-97d5-55e2c48e6c92.png'
  },
  {
    id: 'murphy',
    name: 'Murphy Heat',
    url: 'https://cdn.shopify.com/s/files/1/1147/9910/files/MURPHY_HEATSPLATTER_22_NBA_3D.png'
  }
];

function CircularControl({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center text-indigo-600 hover:text-indigo-800 border-2 border-indigo-100 hover:border-indigo-300"
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

function App() {
  const [glassesStyles, setGlassesStyles] = useState(DEFAULT_GLASSES_STYLES);
  const [selectedGlasses, setSelectedGlasses] = useState(glassesStyles[0]);
  const [glassesConfig, setGlassesConfig] = useState({
    scale: 1,
    rotation: 0,
    position: { x: 50, y: 50 }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adjustScale = (delta: number) => {
    setGlassesConfig(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale + delta))
    }));
  };

  const adjustRotation = (delta: number) => {
    setGlassesConfig(prev => ({
      ...prev,
      rotation: prev.rotation + delta
    }));
  };

  const adjustPosition = (axis: 'x' | 'y', delta: number) => {
    setGlassesConfig(prev => ({
      ...prev,
      position: {
        ...prev.position,
        [axis]: Math.max(0, Math.min(100, prev.position[axis] + delta))
      }
    }));
  };

  const nextGlasses = () => {
    const currentIndex = glassesStyles.findIndex(g => g.id === selectedGlasses.id);
    const nextIndex = (currentIndex + 1) % glassesStyles.length;
    setSelectedGlasses(glassesStyles[nextIndex]);
  };

  const previousGlasses = () => {
    const currentIndex = glassesStyles.findIndex(g => g.id === selectedGlasses.id);
    const prevIndex = (currentIndex - 1 + glassesStyles.length) % glassesStyles.length;
    setSelectedGlasses(glassesStyles[prevIndex]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newGlasses = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: imageUrl
      };
      setGlassesStyles(prev => [...prev, newGlasses]);
      setSelectedGlasses(newGlasses);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Virtual Glasses Try-On</h1>
          <p className="text-gray-600">Try on different glasses styles using your camera!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white relative">
              <Webcam
                className="w-full"
                mirrored={true}
              />
              <img
                src={selectedGlasses.url}
                alt="Glasses"
                className="absolute pointer-events-none"
                style={{
                  left: `${glassesConfig.position.x}%`,
                  top: `${glassesConfig.position.y}%`,
                  transform: `
                    translate(-50%, -50%)
                    rotate(${glassesConfig.rotation}rad)
                    scale(${glassesConfig.scale})
                  `,
                  width: '50%',
                  maxWidth: '300px'
                }}
              />
              
              {/* Floating Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
                {/* Position Controls */}
                <div className="grid grid-cols-3 gap-3">
                  <div></div>
                  <CircularControl label="Move Up" icon={MoveVertical} onClick={() => adjustPosition('y', -2)} />
                  <div></div>
                  <CircularControl label="Move Left" icon={MoveHorizontal} onClick={() => adjustPosition('x', -2)} />
                  <div className="w-12 h-12 rounded-full bg-indigo-600 shadow-lg flex items-center justify-center text-white">
                    <Glasses className="w-6 h-6" />
                  </div>
                  <CircularControl label="Move Right" icon={MoveHorizontal} onClick={() => adjustPosition('x', 2)} />
                  <div></div>
                  <CircularControl label="Move Down" icon={MoveVertical} onClick={() => adjustPosition('y', 2)} />
                  <div></div>
                </div>
              </div>

              {/* Side Controls */}
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
                <CircularControl label="Zoom In" icon={ZoomIn} onClick={() => adjustScale(0.1)} />
                <CircularControl label="Zoom Out" icon={ZoomOut} onClick={() => adjustScale(-0.1)} />
              </div>

              {/* Rotation Controls */}
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
                <CircularControl label="Rotate Left" icon={RotateCcw} onClick={() => adjustRotation(-0.1)} />
                <CircularControl label="Rotate Right" icon={RotateCw} onClick={() => adjustRotation(0.1)} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Glasses className="w-6 h-6" />
                Glasses Style
              </h2>
              
              <div className="flex items-center justify-between gap-4 mb-6">
                <button
                  onClick={previousGlasses}
                  className="p-3 rounded-full hover:bg-indigo-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-indigo-600" />
                </button>
                <span className="text-lg font-medium text-gray-700">
                  {selectedGlasses.name}
                </span>
                <button
                  onClick={nextGlasses}
                  className="p-3 rounded-full hover:bg-indigo-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-indigo-600" />
                </button>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                  <Upload className="w-5 h-5" />
                  Upload Custom Glasses
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-2xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Quick Tips</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li>• Use the circular controls to adjust position</li>
                  <li>• Zoom in/out using the right side buttons</li>
                  <li>• Rotate using the left side buttons</li>
                  <li>• Upload your own glasses design</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;