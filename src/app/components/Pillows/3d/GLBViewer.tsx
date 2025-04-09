import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface GLBViewerProps {
  modelPath: string;
  width?: string;
  height?: string;
  backgroundColor?: string | null; // Allow null for transparent background
  autoRotate?: boolean;
  initialRotation?: {
    x?: number;
    y?: number;
    z?: number;
  };
  viewportWidth?: number; // Add viewportWidth prop
}

const GLBViewerComponent: React.FC<GLBViewerProps> = ({
  modelPath,
  width = "100%",
  height = "400px",
  backgroundColor = "#f0f0f0",
  autoRotate = true,
  initialRotation = { x: 0, y: 0, z: 0 },
  viewportWidth = 0, // Default value
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Capture the current mount point to avoid issues with ref updates during cleanup
    const currentMount = mountRef.current;

    console.log("Setting up GLBViewer for:", modelPath); // Debug log

    // Scene setup
    const scene = new THREE.Scene();
    // If backgroundColor is null or 'transparent', don't set a background color
    if (backgroundColor && backgroundColor !== "transparent") {
      scene.background = new THREE.Color(backgroundColor);
    }
    // If background is meant to be transparent, scene.background remains null

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60, // Narrower FOV for tighter framing
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup with alpha enabled for transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Enable transparency
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Use the modern approach for color management
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Controls setup (only used for auto-rotation, no user interaction)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 3;

    // Disable user interactions
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;

    // Model loading
    let mixer: THREE.AnimationMixer | null = null;
    const loader = new GLTFLoader();
    let modelScene: THREE.Group | null = null; // Keep a reference to the loaded scene

    loader.load(
      modelPath,
      (gltf) => {
        modelScene = gltf.scene; // Store reference
        // Center model
        const box = new THREE.Box3().setFromObject(modelScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Reset model position to center with tighter focus
        modelScene.position.x = -center.x;
        modelScene.position.y = -center.y + 0.25;
        modelScene.position.z = -center.z;

        // Apply initial rotation (in radians)
        modelScene.rotation.x = initialRotation.x || 0;
        modelScene.rotation.y = initialRotation.y || 0;
        modelScene.rotation.z = initialRotation.z || 0;

        // Adjust camera position for tighter focus
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = maxDim / (2 * Math.tan(fov / 2));

        // Position camera closer for tighter rotation based on viewport width
        // Use a smaller multiplier for mobile (e.g., < 768px) to make it smaller
        // Use a larger multiplier for desktop (e.g., >= 768px)
        const distanceMultiplier =
          viewportWidth > 0 && viewportWidth < 768 ? 1.4 : 1.0;
        camera.position.z = cameraDistance * distanceMultiplier;
        controls.update();

        // Handle animations
        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(modelScene); // Use modelScene
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        scene.add(modelScene); // Add modelScene
        setLoading(false);
      },
      (xhr) => {
        setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
      },
      (error) => {
        console.error("An error occurred loading the model:", error);
        setError("Failed to load 3D model");
        setLoading(false);
      }
    );

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      // Check if the component is still mounted before animating
      if (!mountRef.current) return;
      requestAnimationFrame(animate); // Request next frame

      controls.update();

      if (mixer) {
        mixer.update(clock.getDelta());
      }

      renderer.render(scene, camera);
    };

    const animationFrameId = requestAnimationFrame(animate); // Store animation frame id

    // Handle window resize
    const handleResize = () => {
      // Check if the component is still mounted
      if (!mountRef.current || !currentMount) return;

      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      console.log("Cleaning up GLBViewer for:", modelPath); // Debug log
      cancelAnimationFrame(animationFrameId); // Stop animation loop
      window.removeEventListener("resize", handleResize);

      // Dispose controls
      controls.dispose();

      // Dispose scene resources: Geometries, Materials, Textures in the model
      if (modelScene) {
        modelScene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              console.log("Disposing geometry:", object.geometry.uuid);
              object.geometry.dispose();
            }
            if (object.material) {
              // If material is an array, dispose each one
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => {
                  console.log("Disposing material:", material.uuid);
                  // Also dispose textures if they exist
                  if (material.map) material.map.dispose();
                  if (material.lightMap) material.lightMap.dispose();
                  if (material.bumpMap) material.bumpMap.dispose();
                  if (material.normalMap) material.normalMap.dispose();
                  if (material.specularMap) material.specularMap.dispose();
                  if (material.envMap) material.envMap.dispose();
                  material.dispose();
                });
              } else {
                console.log("Disposing material:", object.material.uuid);
                // Also dispose textures if they exist
                if (object.material.map) object.material.map.dispose();
                if (object.material.lightMap)
                  object.material.lightMap.dispose();
                if (object.material.bumpMap) object.material.bumpMap.dispose();
                if (object.material.normalMap)
                  object.material.normalMap.dispose();
                if (object.material.specularMap)
                  object.material.specularMap.dispose();
                if (object.material.envMap) object.material.envMap.dispose();
                object.material.dispose();
              }
            }
          }
        });
        // Remove the model itself after dealing with its contents
        scene.remove(modelScene);
      }

      // Dispose scene lights etc. (Ensure scene still exists)
      // Collect lights first to avoid modifying scene during traversal
      if (scene) {
        const lightsToRemove: THREE.Light[] = [];
        scene.traverse((object) => {
          if (object instanceof THREE.Light) {
            lightsToRemove.push(object);
          }
          // Could add disposal for other scene objects here if needed
        });
        lightsToRemove.forEach((light) => scene.remove(light));
        // Lights don't typically have a .dispose() method unless custom
      }

      // Scene.clear() might be redundant/problematic if we manually remove
      // scene.clear();

      // Dispose renderer
      renderer.dispose();
      console.log("Disposed renderer context:", renderer.info.memory);

      // Remove canvas from DOM
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        console.log("Removing canvas from mount point.");
        currentMount.removeChild(renderer.domElement);
      } else {
        console.log("Canvas already removed or mount point mismatch.");
      }

      // mountRef.current = null // Explicitly nullify the ref? Maybe not necessary if component unmounts
    };
  }, [
    modelPath,
    backgroundColor,
    autoRotate,
    initialRotation,
    width,
    height,
    viewportWidth,
  ]); // Add viewportWidth to dependencies

  return (
    <div
      ref={mountRef}
      style={{
        width,
        height,
        position: "relative",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 1,
          }}
        >
          <div>
            <p>Loading model... {loadingProgress}%</p>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            zIndex: 1,
          }}
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

// Wrap the component with React.memo for performance optimization
const GLBViewer = React.memo(GLBViewerComponent);

export default GLBViewer;
