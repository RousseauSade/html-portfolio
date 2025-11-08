
// --- Datos de Habilidades ---
const SKILLS_DATA = [
    { id: 'Html', image: './Assets/Images/HTML5.png', url: './Assets/HTML/HTML.html', label: 'HTML' },
    { id: 'C', image: './Assets/Images/C++.png', url: './Assets/C++/C++.html', label: 'C++' },
    { id: 'Java', image: './Assets/Images/Java.png', url: './Assets/Java/Java.html', label: 'Java' },
    { id: 'Python', image: './Assets/Images/Python.jpg', url: './Assets/Python/Python.html', label: 'Python' },
    { id: 'Power_BI', image: './Assets/Images/Power_BI.png', url: './Assets/PowerBi/Powerb.html', label: 'Power BI' },
    { id: 'Word', image: './Assets/Images/Word.png', url: null, label: 'Word' },
    { id: 'Excel', image: './Assets/Images/Excel.png', url: './Assets/Excel/Excel.html', label: 'Excel' },
    { id: 'Davinci', image: './Assets/Images/DaVinci_Resolve.png', url: './Assets/Davinci/Davinci.html', label: 'Davinci Resolve' },
];

// --- Three.js Galaxy ---
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('galaxy-container');
    if (!container) return;

    // Crear renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0); // Fondo transparente
    container.appendChild(renderer.domElement);

    // Crear escena y cámara
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const pointLight1 = new THREE.PointLight(0xffffff, 1.5);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0x3498db, 1);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Cargar Texturas y crear "estrellas"
    const loader = new THREE.TextureLoader();
    const skillMeshes = [];
    const INTERACTIVE_SCALE = 2.0;

    SKILLS_DATA.forEach(function(skill, i) {
        loader.load(skill.image, function(texture) {
            const geometry = new THREE.PlaneGeometry(1, 1);
            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, alphaTest: 0.5 });
            const mesh = new THREE.Mesh(geometry, material);

            // Posición en círculo
            const RADIUS_STEP = 1.5;
            const ANGLE_STEP = Math.PI / 4;
            const radius = i * RADIUS_STEP + 3;
            const angle = i * ANGLE_STEP;
            mesh.position.set(
                radius * Math.cos(angle),
                (i % 2 === 0 ? 1 : -1) * 0.5,
                radius * Math.sin(angle)
            );
            mesh.scale.set(1.5, 1.5, 1.5);
            mesh.userData = { url: skill.url, label: skill.label };
            skillMeshes.push(mesh);
            scene.add(mesh);
        });
    });

    // Overlay para mostrar el nombre
    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '50px';
    overlay.style.left = '50px';
    overlay.style.zIndex = '10';
    overlay.style.color = '#3498db';
    overlay.style.fontSize = '2.5rem';
    overlay.style.fontWeight = 'bold';
    overlay.style.textShadow = '0 0 10px rgba(52, 152, 219, 0.8)';
    overlay.style.pointerEvents = 'none';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);

    // Raycaster para interacción
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh = null;

    function onPointerMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onClick(event) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(skillMeshes);
        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            if (mesh.userData.url) {
                window.open(mesh.userData.url, '_self');
            }
        }
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animación
    function animate() {
        requestAnimationFrame(animate);

        // Rotación y hover
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(skillMeshes);
        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            if (hoveredMesh !== mesh) {
                if (hoveredMesh) hoveredMesh.scale.set(1.5, 1.5, 1.5);
                hoveredMesh = mesh;
                mesh.scale.set(INTERACTIVE_SCALE, INTERACTIVE_SCALE, INTERACTIVE_SCALE);
                overlay.textContent = mesh.userData.label;
                overlay.style.display = 'block';
                document.body.style.cursor = mesh.userData.url ? 'pointer' : 'default';
            }
        } else {
            if (hoveredMesh) hoveredMesh.scale.set(1.5, 1.5, 1.5);
            hoveredMesh = null;
            overlay.style.display = 'none';
            document.body.style.cursor = 'default';
        }

        // Animar estrellas
        skillMeshes.forEach(function(mesh, i) {
            mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
            mesh.rotation.y += 0.005;
        });

        renderer.render(scene, camera);
    }
    animate();

    // Responsive
    window.addEventListener('resize', function() {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
    });
});