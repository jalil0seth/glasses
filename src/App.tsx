import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, RotateCw, Glasses, Star } from 'lucide-react';

type GlassesStyle = {
  id: string;
  name: string;
  price: string;
  url: string;
};

function CircularControl({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-brand-600 hover:text-brand-800 border border-brand-100"
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function GlassesThumbnail({ glasses, isSelected, onClick }: { glasses: GlassesStyle, isSelected: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative p-4 rounded-2xl transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-br from-brand-50 to-brand-100/50 ring-2 ring-brand-400' 
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="relative aspect-[3/2] mb-3">
        <img
          src={glasses.url}
          alt={glasses.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {isSelected && (
          <div className="absolute inset-0 ring-2 ring-brand-400 rounded-lg" />
        )}
      </div>
      <div className="text-center">
        <h3 className="font-display text-sm font-medium text-gray-900">{glasses.name}</h3>
        <p className="text-sm font-semibold text-brand-600 mt-1">{glasses.price}</p>
      </div>
    </button>
  );
}

function App() {
  const [glassesStyles, setGlassesStyles] = useState<GlassesStyle[]>([]);
  const [selectedGlasses, setSelectedGlasses] = useState<GlassesStyle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [glassesConfig, setGlassesConfig] = useState({
    scale: 0.8,
    rotation: 0,
    position: { x: 50, y: 50 }
  });

  useEffect(() => {
    fetch('https://api.npoint.io/f9c2911dcfa32a352749')
      .then(response => response.json())
      .then((data: GlassesStyle[]) => {
        setGlassesStyles(data);
        setSelectedGlasses(data[0]);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching glasses:', error);
        setIsLoading(false);
      });
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-50/30 to-brand-100/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-600 font-medium">Chargement des montures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-50/30 to-brand-100/20">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/50 text-brand-700 text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            <span>Essayez avant d'acheter</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-900 mb-3">
            Miroir Virtuel
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection de lunettes et trouvez votre style parfait
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-white">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-brand-500/5" />
              <Webcam
                className="w-full"
                mirrored={true}
              />
              {selectedGlasses && (
                <img
                  src={selectedGlasses.url}
                  alt="Lunettes"
                  className="absolute pointer-events-none"
                  style={{
                    left: `${glassesConfig.position.x}%`,
                    top: `${glassesConfig.position.y}%`,
                    transform: `
                      translate(-50%, -50%)
                      rotate(${glassesConfig.rotation}rad)
                      scale(${glassesConfig.scale})
                    `,
                    width: '40%',
                    maxWidth: '250px'
                  }}
                />
              )}
              
              {/* Desktop Controls */}
              <div className="hidden lg:flex absolute inset-x-0 bottom-8 justify-center">
                <div className="flex items-center gap-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-brand-100">
                  <div className="flex gap-4">
                    <CircularControl label="Gauche" icon={ArrowLeft} onClick={() => adjustPosition('x', -2)} />
                    <div className="grid grid-cols-1 gap-4">
                      <CircularControl label="Haut" icon={ArrowUp} onClick={() => adjustPosition('y', -2)} />
                      <CircularControl label="Bas" icon={ArrowDown} onClick={() => adjustPosition('y', 2)} />
                    </div>
                    <CircularControl label="Droite" icon={ArrowRight} onClick={() => adjustPosition('x', 2)} />
                  </div>
                  <div className="w-px h-14 bg-brand-100" />
                  <div className="flex gap-4">
                    <CircularControl label="Zoom avant" icon={ZoomIn} onClick={() => adjustScale(0.1)} />
                    <CircularControl label="Zoom arrière" icon={ZoomOut} onClick={() => adjustScale(-0.1)} />
                  </div>
                  <div className="w-px h-14 bg-brand-100" />
                  <div className="flex gap-4">
                    <CircularControl label="Rotation gauche" icon={RotateCcw} onClick={() => adjustRotation(-0.1)} />
                    <CircularControl label="Rotation droite" icon={RotateCw} onClick={() => adjustRotation(0.1)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  Collection
                </h2>
                <div className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium">
                  {glassesStyles.length} modèles
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {glassesStyles.map((glasses) => (
                  <GlassesThumbnail
                    key={glasses.id}
                    glasses={glasses}
                    isSelected={selectedGlasses?.id === glasses.id}
                    onClick={() => setSelectedGlasses(glasses)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-[2rem] shadow-xl p-8 text-white">
              <div className="text-center">
                <h3 className="font-display text-xl font-bold mb-4">Guide d'Utilisation</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 justify-center">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ArrowUp className="w-4 h-4" />
                    </span>
                    <span className="text-brand-100">Déplacez avec les flèches</span>
                  </li>
                  <li className="flex items-center gap-3 justify-center">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                    <span className="text-brand-100">Ajustez la taille</span>
                  </li>
                  <li className="flex items-center gap-3 justify-center">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <RotateCw className="w-4 h-4" />
                    </span>
                    <span className="text-brand-100">Tournez pour aligner</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Controls - Fixed at bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_-1px_12px_rgba(0,0,0,0.1)] border-t border-brand-100 p-4">
          <div className="max-w-lg mx-auto flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3 justify-items-center">
              <div />
              <CircularControl label="Haut" icon={ArrowUp} onClick={() => adjustPosition('y', -2)} />
              <div />
              <CircularControl label="Gauche" icon={ArrowLeft} onClick={() => adjustPosition('x', -2)} />
              <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
                <Glasses className="w-5 h-5 text-white" />
              </div>
              <CircularControl label="Droite" icon={ArrowRight} onClick={() => adjustPosition('x', 2)} />
              <div />
              <CircularControl label="Bas" icon={ArrowDown} onClick={() => adjustPosition('y', 2)} />
              <div />
            </div>
            <div className="flex justify-center gap-3">
              <CircularControl label="Zoom avant" icon={ZoomIn} onClick={() => adjustScale(0.1)} />
              <CircularControl label="Zoom arrière" icon={ZoomOut} onClick={() => adjustScale(-0.1)} />
              <CircularControl label="Rotation gauche" icon={RotateCcw} onClick={() => adjustRotation(-0.1)} />
              <CircularControl label="Rotation droite" icon={RotateCw} onClick={() => adjustRotation(0.1)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;