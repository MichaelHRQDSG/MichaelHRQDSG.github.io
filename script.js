// 平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


window.addEventListener('scroll', function () {
    const elements = document.querySelectorAll('.animate');
    elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (position < screenPosition) {
            element.classList.add('fade-in');
        }
    });
});

const container = document.getElementById('globe-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// 创建地球纹理
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('images/earth_map.jpg');

// 创建地球球体
const geometry = new THREE.SphereGeometry(5, 50, 50);
const material = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// 设置相机位置
camera.position.z = 15;

// 动态地点列表 (经纬度)
const locations = [
    { name: "Shenzhen", lat: 22.5431, lon: 114.0579 },
    { name: "Beijing", lat: 39.9042, lon: 116.4074 },
    { name: "Lijiang", lat: 26.8721, lon: 100.233 },
    { name: "Xiamen", lat: 24.4798, lon: 118.0894 },
    { name: "Guiyang", lat: 26.6470, lon: 106.6302 },
    { name: "Shanghai", lat: 31.2304, lon: 121.4737 },
    { name: "Dali", lat: 25.6003, lon: 100.2676 },
    { name: "Chengdu", lat: 30.5728, lon: 104.0668 }
];

// 将经纬度转换为球体上的 3D 坐标
function latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
}

// 添加标记点
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 将标记点颜色改为红色

locations.forEach(location => {
    const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32); // 创建一个小球表示标记点
    const marker = new THREE.Mesh(pointGeometry, pointMaterial);
    const markerPosition = latLongToVector3(location.lat, location.lon, 5); // 半径与地球相同
    marker.position.copy(markerPosition);
    earth.add(marker); // 将标记点附加到地球
});

// 地球旋转动画
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.001; // 让地球慢慢自转
    renderer.render(scene, camera);
}

animate();

// 初始化 OrbitControls 控件
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;  // 启用缩放
controls.enablePan = false;  // 禁用平移
