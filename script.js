// Liste globale de tes photos et vidéo
const mediaData = [
  // 1. Résidentiel
  { type: 'video', src: '20230222_155047.mp4', category: 'residentiel' }, // Chantier Ixelles
  { type: 'image', src: '20240222_115602.jpg', category: 'residentiel' }, // Câblage réseau
  { type: 'image', src: '20250218_111958.jpg', category: 'residentiel' }, // Logette
  { type: 'image', src: '20240327_220913.jpg', category: 'residentiel' }, // Maison de nuit

  // 2. Industriel & Automates
  { type: 'image', src: '20221110_154748.jpg', category: 'industriel' },  // Grille complète
  { type: 'image', src: '20250616_155505.jpg', category: 'industriel' },  // Grille câblage

  // 3. Électronique
  { type: 'image', src: '20260401_091328.jpg', category: 'electronique' }, // Carte HE EPHEC
  { type: 'image', src: '20260519_113245.jpg', category: 'electronique' }, // PCB 7 segments
  { type: 'image', src: '20260401_091330.jpg', category: 'electronique' }, // Labo mesure

  // 4. Autres
  { type: 'image', src: '20260228_144850.jpg', category: 'autres' }       // Figurine 3D
];

// --- GESTION DU CARROUSEL ALEATOIRE ---
const carouselImg = document.getElementById('carousel-img');
const imageOnlyList = mediaData.filter(m => m.type === 'image');

function changeCarouselImage() {
  const randomIndex = Math.floor(Math.random() * imageOnlyList.length);
  carouselImg.style.opacity = 0;
  
  setTimeout(() => {
    carouselImg.src = imageOnlyList[randomIndex].src;
    carouselImg.style.opacity = 1;
  }, 400);
}

// Lancer le défilé toutes les 3 secondes
changeCarouselImage();
setInterval(changeCarouselImage, 3000);

// --- CABLE DU BOUTON "VOIR PLUS" ---
document.getElementById('btn-voir-plus').addEventListener('click', () => {
  document.getElementById('categories-grid').classList.remove('hidden');
  document.getElementById('btn-voir-plus').style.display = 'none';
});

// --- AFFICHER LA GALERIE FILTRÉE ---
function showGallery(categoryKey) {
  const mainPage = document.getElementById('main-page');
  const galleryPage = document.getElementById('gallery-page');
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryTitle = document.getElementById('gallery-title');

  const titles = {
    'residentiel': '🏡 Électricité Résidentielle & Chantiers',
    'industriel': '🏭 Automates & Systèmes Industriels',
    'electronique': '⚡ Cartes PCB & Électronique',
    'autres': '🤖 Prototypes & Autres Projets'
  };

  galleryTitle.innerText = titles[categoryKey];
  galleryGrid.innerHTML = ''; // Vide la galerie courante

  // Récupérer les médias filtrés
  const filteredMedia = mediaData.filter(m => m.category === categoryKey);

  // Générer les éléments dans la page
  filteredMedia.forEach(item => {
    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      galleryGrid.appendChild(img);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      galleryGrid.appendChild(video);
    }
  });

  // Basculer la vue
  mainPage.classList.add('hidden');
  galleryPage.classList.remove('hidden');
}

// --- BOUTON RETOUR ---
function backToMain() {
  document.getElementById('main-page').classList.remove('hidden');
  document.getElementById('gallery-page').classList.add('hidden');
}
