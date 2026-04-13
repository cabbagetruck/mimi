# 미미 생일카드 - 구현 명세 (Specification)

## 기술 스택
- 순수 HTML5 / CSS3 / Vanilla JS (프레임워크 없음)
- HTML Canvas API (픽셀아트 애니메이션)
- 서버 불필요, 정적 파일로 동작

## 프로젝트 구조
```
mimi/
  index.html          -- 단일 HTML (4페이지 포함)
  css/style.css       -- 레이아웃, 테마, 전환 애니메이션
  js/
    app.js            -- 페이지 전환 로직, 타이핑 애니메이션 컨트롤러
    scenes/
      scene1.js       -- 1p 케이크 위 남자 씬
      scene2.js       -- 2p 양배추 트럭 씬
      scene3.js       -- 3p 양배추 피라미드 씬
      scene4.js       -- 4p 무한 줌 타랑해 양배추 씬
    pixel-engine.js   -- 공용 픽셀아트 렌더링 유틸 (캐릭터, 오브젝트 그리기)
  req.md
  spec.md
  tasks.md
```

## 뷰포트 & 디바이스 최적화

### iPhone 17 Pro
- CSS 뷰포트: 402 x 874px, DPR: 3x
- Canvas 해상도: 논리적 402x874, 실제 픽셀은 DPR 고려하여 조정
  - 단, 픽셀아트 특성상 의도적으로 저해상도 렌더링 후 `image-rendering: pixelated`로 업스케일
- 뷰포트 메타: `width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no`
- Safe area: `env(safe-area-inset-top/bottom)` 패딩 적용
- 높이: `100dvh` 사용 (Safari 주소창 대응)

## 디자인 시스템

### 픽셀아트 스타일
- Canvas 렌더링 해상도: ~134 x 291px (402/3, 874/3) → 3배 업스케일로 선명한 픽셀감
- `image-rendering: pixelated` / `-webkit-crisp-edges` 적용
- 색상 팔레트: 슈퍼마리오 계열 원색 (제한된 팔레트 사용으로 레트로 감성)

### 폰트
- 한글 픽셀 폰트: `DungGeunMo` (둥근모꼴) - Google Fonts 또는 CDN
- 영문/숫자 보조: `Press Start 2P`
- 폴백: `-apple-system, sans-serif`

### 색상 팔레트 (슈퍼마리오 레퍼런스)
```
빨강: #E44040 (마리오 모자)
파랑: #4060D0 (하늘/오버올)
녹색: #40A040 (파이프/양배추)
노랑: #F0D020 (코인/별)
갈색: #A06020 (블록)
살색: #F0B080 (피부)
흰색: #F8F8F8
검정: #181818
하늘색: #70B0F0 (배경 하늘)
```

### 레이아웃
- 전체 화면 Canvas (상단 ~60%)에 애니메이션 장면
- 하단 ~40%는 단색/그라데이션 배경으로 텍스트 영역
  - Canvas 내에서 하단부를 단조로운 배경색으로 채워 자연스럽게 연결
- 텍스트는 Canvas 위에 HTML 오버레이로 배치 (DOM 요소)
- 버튼도 HTML 오버레이 (Canvas 밖)

## 페이지 구조 (index.html)

```html
<div id="app">
  <section class="page active" id="page-1">
    <canvas id="canvas-1"></canvas>
    <div class="text-overlay">
      <p class="typing-text" data-text="미미 생일축하해!"></p>
    </div>
    <button class="next-btn">다음</button>
  </section>
  <!-- page-2, 3, 4 동일 구조 (4는 버튼 없음) -->
</div>
```

## 페이지 전환
- 4개 `<section>`이 겹쳐있고, `.active` 클래스로 표시 전환
- 전환 애니메이션: fade out → fade in (CSS transition, ~500ms)
- 전환 시 이전 Canvas 애니메이션 정지, 새 Canvas 시작
- 타이핑 애니메이션은 페이지 전환 완료 후 시작

## 타이핑 애니메이션
- JS 기반: `setInterval`로 `textContent`에 한 글자씩 추가
- 속도: ~100ms/글자
- 페이지 활성화 후 500ms 딜레이 → 타이핑 시작
- 타이핑 완료 후 버튼 fade-in (1~3p)

## 씬별 Canvas 애니메이션 명세

### Scene 1: 케이크 위의 남자
- 배경: 하늘색 단색 배경
- 오브젝트: 화면 하단 2/3를 차지하는 거대한 생일 케이크 (3단, 분홍+흰색 크림)
- 캐릭터: 케이크 꼭대기에 서있는 픽셀 남자 (8-16px 스프라이트)
  - 왼손: 케이크만한 큰 초를 들고 있음
  - 오른손: 좌우로 흔드는 인사 애니메이션 (2-3프레임 루프)
- 이펙트: 촛불 일렁임 (불꽃 2-3프레임 애니메이션)
- 하단부: 케이크 몸체가 자연스럽게 단조로운 영역 역할

### Scene 2: 양배추 트럭
- 배경: 도로/시장 느낌의 배경
- 오브젝트: 초록색 양배추 트럭 (화면 중앙)
- 캐릭터: 트럭 앞 여자 + 남자 픽셀 캐릭터
  - 양배추를 들고 있는 포즈
- 클로즈업 연출: 일정 시간 후 여자 캐릭터 얼굴 확대 (Canvas scale 애니메이션)
  - 쳐진 눈꼬리 디테일 표현
- 하단부: 도로/바닥이 단조로운 배경 역할

### Scene 3: 양배추 피라미드
- 배경: 밝은 하늘
- 오브젝트: 피라미드 형태로 쌓인 양배추 더미 (중앙)
- 캐릭터 좌: 양배추 더미 앞에 등을 보이고 당당하게 서있는 남자 (팔짱 또는 허리에 손)
- 캐릭터 우: 썬베드에 누운 여자, 선글라스 착용, 칵테일 들고 있음
- 이펙트:
  - 피라미드 꼭대기 양배추: 반짝 효과 (별 모양 스파클, 2-3프레임)
  - 선글라스: 반짝 효과 (동일한 스파클)
- 하단부: 잔디/바닥이 단조로운 배경 역할

### Scene 4: 무한 줌 타랑해 양배추
- 초기 화면: 양배추 1개 클로즈업, 위에 삐뚤삐뚤한 '타랑해' 텍스트, 꽂힌 촛불
- 촛불 불꽃 일렁임 애니메이션
- **무한 줌 루프 구현:**
  1. 촛불 심지 방향으로 서서히 줌인 (Canvas scale 증가)
  2. 특정 줌 레벨에 도달하면 동일한 양배추+초 장면이 다시 나타남
  3. 크로스페이드로 자연스럽게 리셋 → 다시 줌인
  4. 이 과정 무한 반복
- 기법: 듀얼 레이어 — 두 Canvas를 교차 사용하여 끊김 없는 루프

## pixel-engine.js 공용 유틸

### 주요 함수
- `drawPixelChar(ctx, x, y, spriteData, scale)` — 스프라이트 데이터 기반 캐릭터 그리기
- `drawRect(ctx, x, y, w, h, color)` — 픽셀 사각형
- `animateSparkle(ctx, x, y, frame)` — 반짝이 이펙트
- `animateFlame(ctx, x, y, frame)` — 촛불 불꽃
- `drawCabbage(ctx, x, y, scale)` — 양배추 (여러 씬에서 재사용)

### 스프라이트 데이터 구조
- 2D 배열 형태의 색상 맵 (예: `[[null, '#E44040', ...], ...]`)
- 각 캐릭터/오브젝트는 8x8 ~ 16x16 픽셀 스프라이트
- 애니메이션 프레임은 스프라이트 배열로 관리

## 배포
- 1차: 로컬 파일로 테스트 (`file://` 프로토콜)
- 2차: GitHub Pages 또는 Netlify에 무료 호스팅 → 링크 공유
