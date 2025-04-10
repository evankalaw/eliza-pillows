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
  viewportWidth?: number;
}

const GLBViewerComponent: React.FC<GLBViewerProps> = ({
  modelPath,
  width = "100%",
  height = "400px",
  backgroundColor = "#f0f0f0",
  autoRotate = true,
  initialRotation = { x: 0, y: 0, z: 0 },
  viewportWidth = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Capture the current mount point to avoid issues with ref updates during cleanup
    const currentMount = mountRef.current;

    console.log("Setting up GLBViewer for:", modelPath);

    const scene = new THREE.Scene();
    // If backgroundColor is null or 'transparent', don't set a background color
    if (backgroundColor && backgroundColor !== "transparent") {
      scene.background = new THREE.Color(backgroundColor);
    }
    // If background is meant to be transparent, scene.background remains null (default)

    const camera = new THREE.PerspectiveCamera(
      50, // Narrower FOV for tighter framing
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup with alpha support for transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Enable transparency in the canvas
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Use SRGBColorSpace for accurate color representation
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
    // Use ACES Filmic tone mapping for better contrast and a cinematic look
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1; // Adjust exposure if needed
    currentMount.appendChild(renderer.domElement);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.02); // Low ambient light to emphasize spotlight
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.05); // Subtle directional light for fill
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Spotlight to highlight the model
    const spotlight = new THREE.SpotLight(0xffffff, 120); // High intensity for dramatic effect
    spotlight.position.set(3, 5, 4); // Initial position, updated dynamically based on camera
    spotlight.angle = Math.PI / 15; // Narrow cone
    spotlight.penumbra = 0.3; // Soft edge
    spotlight.decay = 2.5; // Realistic light falloff
    spotlight.castShadow = true;
    // Configure shadow map properties
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    spotlight.shadow.camera.near = 1;
    spotlight.shadow.camera.far = 20;
    spotlight.shadow.focus = 1; // Sharpens shadows

    scene.add(spotlight);

    // Optional: Spotlight helper for visualizing the light cone during debugging
    // const spotLightHelper = new THREE.SpotLightHelper(spotlight);
    // scene.add(spotLightHelper);

    // OrbitControls for auto-rotation (user interaction is disabled)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 3;

    // Disable user interactions
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;

    // Model Loading
    let mixer: THREE.AnimationMixer | null = null;
    const loader = new GLTFLoader();
    let modelScene: THREE.Group | null = null; // Reference to the loaded GLTF scene
    // Dedicated object for the spotlight to target, allows independent movement/positioning
    const spotlightTarget = new THREE.Object3D();

    loader.load(
      modelPath,
      (gltf) => {
        modelScene = gltf.scene; // Store reference to the loaded scene
        // Calculate bounding box to center and scale the model
        const box = new THREE.Box3().setFromObject(modelScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center the model in the scene, slightly raised
        modelScene.position.x = -center.x;
        modelScene.position.y = -center.y + 0.25;
        modelScene.position.z = -center.z;

        // Ensure all meshes within the model cast shadows
        modelScene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            // Optionally, enable receiveShadow if the model should have shadows cast onto it
            // node.receiveShadow = true;
          }
        });

        // Apply initial rotation if specified (radians)
        modelScene.rotation.x = initialRotation.x || 0;
        modelScene.rotation.y = initialRotation.y || 0;
        modelScene.rotation.z = initialRotation.z || 0;

        // Adjust camera distance based on model size for a tight fit
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = maxDim / (2 * Math.tan(fov / 2));

        // Position camera closer on smaller viewports for better visibility
        // Use a smaller multiplier for mobile (< 768px) to make the model appear larger relative to the viewport
        // Use a larger multiplier for desktop (>= 768px)
        const distanceMultiplier =
          viewportWidth > 0 && viewportWidth < 768 ? 1.4 : 1.0;
        camera.position.z = cameraDistance * distanceMultiplier;
        controls.update(); // Apply camera changes

        // Position the spotlight target at the center of the model (slightly elevated)
        // The spotlight itself will point towards this object
        spotlightTarget.position.set(
          modelScene.position.x,
          modelScene.position.y + size.y / 2, // Target slightly above the base center
          modelScene.position.z
        );
        scene.add(spotlightTarget); // Add the target to the scene
        spotlight.target = spotlightTarget; // Make the spotlight track the target object

        // Set up animation playback if the model has animations
        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(modelScene); // Animation mixer needs the scene root
          const action = mixer.clipAction(gltf.animations[0]); // Play the first animation
          action.play();
        }

        scene.add(modelScene); // Add the fully configured model to the scene
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

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      // Ensure component is still mounted before proceeding
      if (!mountRef.current) return;
      requestAnimationFrame(animate);

      controls.update(); // Required for damping and auto-rotation

      // Dynamically update spotlight position to follow the camera
      const cameraWorldPos = new THREE.Vector3();
      camera.getWorldPosition(cameraWorldPos);
      const targetPosition = spotlightTarget.position;
      // Calculate direction from target to camera
      const direction = new THREE.Vector3()
        .subVectors(cameraWorldPos, targetPosition)
        .normalize();
      const spotlightDistance = 8; // Distance of the spotlight source from the target
      // Position the spotlight along the direction vector
      const desiredSpotlightPos = targetPosition
        .clone()
        .add(direction.multiplyScalar(spotlightDistance));
      spotlight.position.copy(desiredSpotlightPos);

      // Update animation mixer if animations are present
      if (mixer) {
        mixer.update(clock.getDelta());
      }

      // Update spotlight helper if used for debugging
      // spotLightHelper.update();

      renderer.render(scene, camera);
    };

    const animationFrameId = requestAnimationFrame(animate); // Store the request ID for cancellation

    // Handle window resize events to keep the viewport correct
    const handleResize = () => {
      // Ensure component is still mounted
      if (!mountRef.current || !currentMount) return;

      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function: Called when the component unmounts
    return () => {
      console.log("Cleaning up GLBViewer for:", modelPath);
      cancelAnimationFrame(animationFrameId); // Stop the animation loop
      window.removeEventListener("resize", handleResize);

      // Dispose OrbitControls
      controls.dispose();

      // Dispose Three.js resources to prevent memory leaks
      if (modelScene) {
        modelScene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            // Dispose geometries
            if (object.geometry) {
              object.geometry.dispose();
            }
            // Dispose materials and their textures
            if (object.material) {
              if (Array.isArray(object.material)) {
                // Handle multi-materials
                object.material.forEach((material) => {
                  // Dispose textures associated with the material
                  if (material.map) material.map.dispose();
                  if (material.lightMap) material.lightMap.dispose();
                  if (material.bumpMap) material.bumpMap.dispose();
                  if (material.normalMap) material.normalMap.dispose();
                  if (material.specularMap) material.specularMap.dispose();
                  if (material.envMap) material.envMap.dispose();
                  material.dispose(); // Dispose the material itself
                });
              } else {
                // Handle single material
                // Dispose textures associated with the material
                if (object.material.map) object.material.map.dispose();
                if (object.material.lightMap)
                  object.material.lightMap.dispose();
                if (object.material.bumpMap) object.material.bumpMap.dispose();
                if (object.material.normalMap)
                  object.material.normalMap.dispose();
                if (object.material.specularMap)
                  object.material.specularMap.dispose();
                if (object.material.envMap) object.material.envMap.dispose();
                object.material.dispose(); // Dispose the material itself
              }
            }
          }
        });
        // Remove the model from the scene after disposing its contents
        scene.remove(modelScene);
      }

      // Dispose lights and other scene objects
      if (scene) {
        // Collect lights first to avoid modifying the scene during traversal
        const lightsToRemove: THREE.Light[] = [];
        scene.traverse((object) => {
          if (object instanceof THREE.Light) {
            lightsToRemove.push(object);
          }
          // Add other object types here if necessary (e.g., helpers)
        });
        lightsToRemove.forEach((light) => scene.remove(light));
        // Note: Standard lights don't typically have a .dispose() method
      }

      // Remove spotlight and its target object
      scene.remove(spotlight);
      if (spotlight.target) {
        scene.remove(spotlight.target); // Important: remove the Object3D target
      }
      // Remove spotlight helper if it was added
      // scene.remove(spotLightHelper);

      // Avoid calling scene.clear() as manual disposal is more thorough
      // scene.clear();

      // Dispose the WebGLRenderer resources
      renderer.dispose();

      // Remove the canvas element from the DOM
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }

      // Explicitly nullifying mountRef.current might not be necessary
      // mountRef.current = null
    };
  }, [
    modelPath,
    backgroundColor,
    autoRotate,
    initialRotation,
    width,
    height,
    viewportWidth, // Ensure viewportWidth changes trigger effect updates
  ]);

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

// Memoize the component to prevent unnecessary re-renders if props haven't changed
const GLBViewer = React.memo(GLBViewerComponent);

export default GLBViewer;
