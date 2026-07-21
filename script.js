// Remplace ici avec les exacts noms de tes fichiers dans GitHub
const mediaData = [
  // Résidentiel
  { type: 'video', src: '20230222_155047.mp4', category: 'residentiel' },
  { type: 'image', src: '20240222_115602.jpg', category: 'residentiel' },
  { type: 'image', src: '20250218_111958.jpg', category: 'residentiel' },
  { type: 'image', src: '20240327_220913.jpg', category: 'residentiel' },

  // Industriel
  { type: 'image', src: '20221110_154748.jpg', category: 'industriel' },
  { type: 'image', src: '20250616_155505.jpg', category: 'industriel' },

  // Électronique
  { type: 'image', src: '20260401_091328.jpg', category: 'electronique' },
  { type: 'image', src: '20260519_113245.jpg', category: 'electronique' },
  { type: 'image', src: '20260401_091330.jpg', category: 'electronique' },

  // Autres
  { type: 'image', src: '20260228_144850.jpg', category: 'autres' }
];

// Defilement Aleatoire
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

changeCarouselImage();
setInterval(changeCarouselImage, 3000);

// Bouton Voir Plus
document.getElementById('btn-voir-plus').addEventListener('click', () => {
  document.getElementById('categories-grid').classList.remove('hidden');
  document.getElementById('btn-voir-plus').style.display = 'none';
});

// Galerie Filtrée
function showGallery(categoryKey) {
  const mainHero = document.getElementById('hero');
  const categoriesGrid = document.getElementById('categories-grid');
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
  galleryGrid.innerHTML = '';

  const filteredMedia = mediaData.filter(m => m.category === categoryKey);

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

  mainHero.classList.add('hidden');
  categoriesGrid.classList.add('hidden');
  galleryPage.classList.remove('hidden');
}

// Bouton Retour
function backToMain() {
  document.getElementById('hero').classList.remove('hidden');
  document.getElementById('categories-grid').classList.remove('hidden');
  document.getElementById('gallery-page').classList.add('hidden');
}
