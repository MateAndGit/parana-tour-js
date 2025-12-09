const tourSpots = [
    { 
        id: 1, 
        title: 'Parque Urquiza', 
        category: 'naturaleza', 
        desc: 'El pulmón verde de la ciudad. Ideal para caminar y tomar unos mates frente al río.', 
        img: 'https://loremflickr.com/640/480/park,trees' 
    },
    { 
        id: 2, 
        title: 'Costanera de Paraná', 
        category: 'naturaleza', 
        desc: 'Disfrutá de una vista increíble del río Paraná. Perfecta para hacer deportes.', 
        img: 'https://loremflickr.com/640/480/river,water' 
    },
    { 
        id: 3, 
        title: 'Catedral de Paraná', 
        category: 'cultura', 
        desc: 'Un icono histórico frente a la Plaza 1º de Mayo. Arquitectura impresionante.', 
        img: 'https://loremflickr.com/640/480/cathedral,architecture' 
    },
    { 
        id: 4, 
        title: 'Parrillas & Asado', 
        category: 'gastronomia', 
        desc: 'No te podés ir sin probar un buen asado con vino Malbec.', 
        img: 'https://loremflickr.com/640/480/barbecue,steak' 
    },
    { 
        id: 5, 
        title: 'Playa Thompson', 
        category: 'naturaleza', 
        desc: 'Sol, arena y río. El lugar favorito para pasar el verano con amigos.', 
        img: 'https://loremflickr.com/640/480/beach,sand' 
    },
    { 
        id: 6, 
        title: 'Teatro 3 de Febrero', 
        category: 'cultura', 
        desc: 'El centro cultural más importante de la provincia. Una joya arquitectónica.', 
        img: 'https://loremflickr.com/640/480/theater,opera' 
    },
];

// 화면 그리기 (Render)
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

// 필터링 
function filterSpots(category) {
    if (category === 'all') {
        drawSpots(tourSpots);
    } else {
        const filtered = tourSpots.filter(spot => spot.category === category);
        drawSpots(filtered);
    }
}

// 스크롤 이동
function scrollToSpots() {
    document.querySelector('.spots-section').scrollIntoView({ behavior: 'smooth' });
}

// 날씨 기능
// --- 날씨 API 연동 (Open-Meteo) ---

// 파라나 좌표
const LAT = -31.73;
const LON = -60.51;

async function getParanaWeather() {
    try {
        // 1. API 요청 보내기 (GET) - 섭씨(celsius) 기준, 현재 날씨만 가져오기
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&timezone=auto`;
        
        const response = await fetch(url);
        const data = await response.json(); // JSON으로 변환

        // 2. 필요한 데이터만 꺼내기
        const temp = Math.round(data.current.temperature_2m); // 온도 (반올림)
        const code = data.current.weather_code; // 날씨 상태 코드 (0: 맑음, 1~3: 흐림, 그외: 비/눈)

        // 3. 날씨 코드에 따라 이모지랑 텍스트 정하기
        let weatherStatus = '';
        let icon = '';

        if (code === 0) {
            weatherStatus = 'Soleado'; // 맑음
            icon = '☀️';
        } else if (code >= 1 && code <= 3) {
            weatherStatus = 'Nublado'; // 구름
            icon = '☁️';
        } else if (code >= 50) {
            weatherStatus = 'Lluvia'; // 비
            icon = '🌧️';
        } else {
            weatherStatus = 'Paraná'; // 그 외
            icon = '🌡️';
        }

        // 4. HTML에 꽂아넣기
        const weatherBox = document.getElementById('weather-box');
        weatherBox.innerHTML = `${icon} ${temp}°C - ${weatherStatus}`;
        
    } catch (error) {
        console.error("날씨를 못 가져왔어요 ㅠㅠ", error);
        document.getElementById('weather-box').innerText = "Paraná, Entre Ríos";
    }
}


// 검색 기능 
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function() {
    const keyword = searchInput.value.toLowerCase();

    const searchResult = tourSpots.filter(spot => {
        return spot.title.toLowerCase().includes(keyword) || 
               spot.desc.toLowerCase().includes(keyword);
    });

    drawSpots(searchResult);
});

// 초기 실행
drawSpots(tourSpots);
getParanaWeather();

// --- [NEW] 즐겨찾기(찜) 관련 로직 ---

// 1. 내 찜 목록 가져오기 (SELECT)
function getLikedItems() {
    // localStorage에서 'likedSpots'라는 키로 저장된 걸 가져옴
    const stored = localStorage.getItem('likedSpots');
    // 없으면 빈 배열([]), 있으면 JSON 문자열을 배열로 변환
    return stored ? JSON.parse(stored) : [];
}

// 2. 찜 목록 저장하기 (INSERT / UPDATE)
function saveLikedItems(items) {
    // 배열을 JSON 문자열로 바꿔서 저장 (localStorage는 문자열만 저장 가능)
    localStorage.setItem('likedSpots', JSON.stringify(items));
}

// 3. 하트 버튼 클릭 시 실행 (Toggle)
function toggleLike(id) {
    let likedItems = getLikedItems(); // 현재 찜 목록 가져오기

    // 이미 찜했는지 확인 (contains)
    if (likedItems.includes(id)) {
        // 이미 있으면 -> 삭제 (Filter로 걸러냄)
        likedItems = likedItems.filter(itemId => itemId !== id);
    } else {
        // 없으면 -> 추가 (Push)
        likedItems.push(id);
    }

    // 변경된 목록 저장 (Commit)
    saveLikedItems(likedItems);

    // 화면 다시 그리기 (새로고침 없이 반영) -> 성능을 위해 버튼만 바꿀 수도 있지만 일단 쉽게 갑니다
    // 현재 검색어나 필터 상태가 있다면 유지해야 하지만, 일단 전체 다시 그리기
    // (더 완벽하게 하려면 현재 필터 상태를 저장하는 전역 변수가 필요합니다)
    drawSpots(tourSpots); 
}


// --- 기존 화면 그리기 함수 수정 ---

function drawSpots(data) {
    const container = document.getElementById('spot-container');
    container.innerHTML = ''; 

    // [NEW] 찜 목록 미리 가져오기
    const likedItems = getLikedItems();

    data.forEach(spot => {
        // [NEW] 이 관광지가 찜 목록에 있는지 확인
        const isLiked = likedItems.includes(spot.id);
        
        // 찜 했으면 빨간 하트(❤️), 안 했으면 빈 하트(🤍)
        // class에 'liked'가 있으면 CSS에서 빨간색으로 만듦
        const heartIcon = isLiked ? '❤️' : '🤍';
        const activeClass = isLiked ? 'liked' : '';

        const catName = spot.category.charAt(0).toUpperCase() + spot.category.slice(1);

        const html = `
            <div class="card">
                <!-- [NEW] 하트 버튼 추가 -->
                <!-- onclick 이벤트로 자신의 ID를 넘김 -->
                <button class="like-btn ${activeClass}" onclick="toggleLike(${spot.id})">
                    ${heartIcon}
                </button>

                <img src="${spot.img}" alt="${spot.title}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
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