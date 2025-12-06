// 1. 관광지 데이터 (Datos Turísticos)
const tourSpots = [
    { 
        id: 1, 
        title: 'Parque Urquiza', 
        category: 'naturaleza', 
        desc: 'El pulmón verde de la ciudad. Ideal para caminar y tomar unos mates frente al río.', 
        // 공원, 나무 사진 랜덤
        img: 'https://loremflickr.com/640/480/park,trees' 
    },
    { 
        id: 2, 
        title: 'Costanera de Paraná', 
        category: 'naturaleza', 
        desc: 'Disfrutá de una vista increíble del río Paraná. Perfecta para hacer deportes.', 
        // 강, 물 사진 랜덤
        img: 'https://loremflickr.com/640/480/river,water' 
    },
    { 
        id: 3, 
        title: 'Catedral de Paraná', 
        category: 'cultura', 
        desc: 'Un icono histórico frente a la Plaza 1º de Mayo. Arquitectura impresionante.', 
        // 성당, 건축물 사진
        img: 'https://loremflickr.com/640/480/cathedral,architecture' 
    },
    { 
        id: 4, 
        title: 'Parrillas & Asado', 
        category: 'gastronomia', 
        desc: 'No te podés ir sin probar un buen asado con vino Malbec.', 
        // 바베큐, 고기 사진
        img: 'https://loremflickr.com/640/480/barbecue,steak' 
    },
    { 
        id: 5, 
        title: 'Playa Thompson', 
        category: 'naturaleza', 
        desc: 'Sol, arena y río. El lugar favorito para pasar el verano con amigos.', 
        // 해변, 모래 사진
        img: 'https://loremflickr.com/640/480/beach,sand' 
    },
    { 
        id: 6, 
        title: 'Teatro 3 de Febrero', 
        category: 'cultura', 
        desc: 'El centro cultural más importante de la provincia. Una joya arquitectónica.', 
        // 극장, 오페라 사진
        img: 'https://loremflickr.com/640/480/theater,opera' 
    },
];

// 2. 화면 그리기 (Render)
const container = document.getElementById('spot-container');

function drawSpots(data) {
    container.innerHTML = ''; 

    data.forEach(spot => {
        const catName = spot.category.charAt(0).toUpperCase() + spot.category.slice(1);

        const html = `
            <div class="card">
                <img src="${spot.img}" alt="${spot.title}">
                <div class="card-info">
                    <span class="card-cat">#${catName}</span>
                    <h3 class="card-title">${spot.title}</h3>
                    <p class="card-desc">${spot.desc}</p>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// 3. 필터링 (Filtrar)
function filterSpots(category) {
    if (category === 'all') {
        drawSpots(tourSpots);
    } else {
        const filtered = tourSpots.filter(spot => spot.category === category);
        drawSpots(filtered);
    }
}

// 4. 스크롤 이동
function scrollToSpots() {
    document.querySelector('.spots-section').scrollIntoView({ behavior: 'smooth' });
}

// 초기 실행
drawSpots(tourSpots);