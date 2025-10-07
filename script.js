// --- Existing Menu and Scroll Logic ---
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuIcon.classList.toggle('fa-xmark');
});

window.addEventListener('scroll', () => {
    const top = window.scrollY;

    sections.forEach(sec => {
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`header nav a[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });

    document.querySelector('header').classList.toggle('sticky', top > 100);

    navbar.classList.remove('active');
    menuIcon.classList.remove('fa-xmark');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navbar.classList.remove('active');
            menuIcon.classList.remove('fa-xmark');
        }
    });
});


// --- Three.js Background Animation (Home Section) ---
let scene, camera, renderer, particles, lines;
const bgCanvas = document.getElementById('bg-canvas');
const mouse = new THREE.Vector2();

function initHomeScene() {
    if (!bgCanvas) return;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 150;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({ size: 0.3, color: 0x00abf0 });
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00abf0, transparent: true, opacity: 0.1 });
    const lineGeometry = new THREE.BufferGeometry();
    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
}

// --- Three.js 3D Model (About Section) ---
let aboutScene, aboutCamera, aboutRenderer, aboutShape;
const aboutCanvas = document.getElementById('about-canvas');

function initAboutScene() {
    if (!aboutCanvas) return;
    aboutScene = new THREE.Scene();
    const container = document.querySelector('.about-3d-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    aboutCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    aboutCamera.position.z = 15;

    aboutRenderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, alpha: true });
    aboutRenderer.setSize(width, height);
    aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.IcosahedronGeometry(7, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0x00abf0, wireframe: true });
    aboutShape = new THREE.Mesh(geometry, material);
    aboutScene.add(aboutShape);

    // Mouse interaction for rotation
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    aboutCanvas.addEventListener('mousedown', (e) => {
        isMouseDown = true;
    });

    aboutCanvas.addEventListener('mouseup', (e) => {
        isMouseDown = false;
    });
    
    aboutCanvas.addEventListener('mouseleave', (e) => {
        isMouseDown = false;
    });

    aboutCanvas.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        aboutShape.rotation.y += deltaMove.x * 0.005;
        aboutShape.rotation.x += deltaMove.y * 0.005;

        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });
}


function onWindowResize() {
    // Home Scene
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // About Scene
    const container = document.querySelector('.about-3d-container');
    if (aboutCamera && aboutRenderer && container) {
        aboutCamera.aspect = container.clientWidth / container.clientHeight;
        aboutCamera.updateProjectionMatrix();
        aboutRenderer.setSize(container.clientWidth, container.clientHeight);
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function connectParticles() {
    if (!particles) return;
    const positions = particles.geometry.attributes.position.array;
    const maxDistance = 15;
    let vertices = [];
    for (let i = 0; i < positions.length; i += 3) {
        for (let j = i + 3; j < positions.length; j += 3) {
            const dx = positions[i] - positions[j];
            const dy = positions[i + 1] - positions[j + 1];
            const dz = positions[i + 2] - positions[j + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (distance < maxDistance) {
                vertices.push(positions[i], positions[i + 1], positions[i + 2]);
                vertices.push(positions[j], positions[j + 1], positions[j + 2]);
            }
        }
    }
    lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
}

function animate() {
    requestAnimationFrame(animate);

    // Home Scene Animation
    if (scene && particles && renderer) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
        const targetRotation = { x: mouse.y * 0.1, y: mouse.x * 0.1 };
        particles.rotation.x += (targetRotation.x - particles.rotation.x) * 0.02;
        particles.rotation.y += (targetRotation.y - particles.rotation.y) * 0.02;
        connectParticles();
        renderer.render(scene, camera);
    }

    // About Scene Animation
    if (aboutScene && aboutShape && aboutRenderer) {
        // Slow constant rotation
        if (!aboutCanvas.matches(':hover')) {
            aboutShape.rotation.x += 0.001;
            aboutShape.rotation.y += 0.001;
        }
        aboutRenderer.render(aboutScene, aboutCamera);
    }
}

// --- Contact Form Submission ---
const contactForm = document.querySelector('.contact form');
const submitBtn = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const data = {
        fullName: contactForm.querySelector('input[placeholder="Full Name"]').value,
        email: contactForm.querySelector('input[placeholder="Email Address"]').value,
        mobile: contactForm.querySelector('input[placeholder="Mobile Number"]').value,
        subject: contactForm.querySelector('input[placeholder="Email Subject"]').value,
        message: contactForm.querySelector('textarea[placeholder="Your Message"]').value,
    };

    // --- THIS IS THE UPDATED LINE ---
    // It now points to your live backend on Render
    const backendUrl = 'https://peace-portfolio-backend.onrender.com/send-email';

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            contactForm.reset();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Could not connect to the server. Please check your connection.', 'error');
    }
});


// --- Toast Notification Function ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 5000);
}


// Initialize and run scenes
initHomeScene();
initAboutScene();
animate();

