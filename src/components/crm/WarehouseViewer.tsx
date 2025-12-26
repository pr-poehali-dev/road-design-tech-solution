import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Cylinder } from '@react-three/drei';

interface WarehouseViewerProps {
  params: {
    length: number;
    width: number;
    height: number;
    constructionType: string;
    roofType: string;
    roofAngle: number;
    columnStep: number;
    gatesCount: number;
    windowsCount: number;
  };
}

const WarehouseModel = ({ params }: WarehouseViewerProps) => {
  const { length, width, height, columnStep, gatesCount, windowsCount } = params;
  
  const columnsX = Math.floor(length / columnStep) + 1;
  const columnsY = Math.floor(width / columnStep) + 1;

  const columns: JSX.Element[] = [];
  for (let i = 0; i < columnsX; i++) {
    for (let j = 0; j < columnsY; j++) {
      const x = (i * columnStep) - length / 2;
      const z = (j * columnStep) - width / 2;
      columns.push(
        <Cylinder
          key={`col-${i}-${j}`}
          args={[0.3, 0.3, height, 8]}
          position={[x, height / 2, z]}
        >
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
        </Cylinder>
      );
    }
  }

  const wallThickness = 0.2;
  
  const gates: JSX.Element[] = [];
  for (let i = 0; i < gatesCount; i++) {
    const spacing = length / (gatesCount + 1);
    gates.push(
      <Box
        key={`gate-${i}`}
        args={[4, 4.5, wallThickness]}
        position={[(i + 1) * spacing - length / 2, 2.25, -width / 2]}
      >
        <meshStandardMaterial color="#ff9800" metalness={0.5} roughness={0.3} />
      </Box>
    );
  }

  const windows: JSX.Element[] = [];
  for (let i = 0; i < windowsCount; i++) {
    const spacing = length / (windowsCount + 1);
    windows.push(
      <Box
        key={`window-${i}`}
        args={[2, 1.5, wallThickness]}
        position={[(i + 1) * spacing - length / 2, height - 2, width / 2]}
      >
        <meshStandardMaterial color="#4fc3f7" transparent opacity={0.6} />
      </Box>
    );
  }

  return (
    <group>
      <Box args={[length, wallThickness, width]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#333333" />
      </Box>

      <Box args={[length, height, wallThickness]} position={[0, height / 2, -width / 2]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[length, height, wallThickness]} position={[0, height / 2, width / 2]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[wallThickness, height, width]} position={[-length / 2, height / 2, 0]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[wallThickness, height, width]} position={[length / 2, height / 2, 0]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>

      <Box args={[length, wallThickness, width]} position={[0, height + 0.5, 0]}>
        <meshStandardMaterial color="#2196f3" metalness={0.7} roughness={0.3} />
      </Box>

      {columns}
      {gates}
      {windows}
    </group>
  );
};

export const WarehouseViewer = ({ params }: WarehouseViewerProps) => {
  return (
    <div className="w-full aspect-video bg-slate-950 rounded-lg overflow-hidden">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-cyan-400">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Загрузка 3D-модели...</p>
          </div>
        </div>
      }>
        <Canvas camera={{ position: [params.length * 1.5, params.height * 1.5, params.width * 1.5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
          <directionalLight position={[-10, 20, -10]} intensity={0.5} />
          
          <WarehouseModel params={params} />
          
          <Grid
            args={[100, 100]}
            position={[0, -0.1, 0]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#00ffff"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#0088ff"
            fadeDistance={80}
            fadeStrength={1}
          />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={params.length * 0.5}
            maxDistance={params.length * 3}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};