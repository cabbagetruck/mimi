# 미미 생일카드 - 구현 명세 (Specification)

## 기술 스택
- 순수 HTML5 / CSS3 / Vanilla JS (프레임워크 없음)
- HTML Canvas API (픽셀아트 애니메이션)
- 서버 불필요, 정적 파일로 동작

## 프로젝트 구조
```
mimi/
  index.html              -- 단일 HTML (4페이지 포함)
  css/style.css           -- 레이아웃, 테마, 전환 애니메이션
  js/
    app.js                -- 페이지 전환 로직, 타이핑 애니메이션 컨트롤러
    pixel-engine.js       -- 공용 렌더링 유틸 + scene 레지스트리
    scenes/
      scene1.js           -- 1p 케이크 위 남자
      scene2.js           -- 2p 양배추 트럭 + 클로즈업
      scene3.js           -- 3p 양배추 피라미드 + mimi.png
      scene4.js           -- 4p 프랙탈 무한 줌
  assets/
    mimi.png              -- 3p 여성 캐릭터 외부 이미지
```

## 뷰포트 & 디바이스 최적화
- 대상: iPhone 17 Pro (CSS 402x874, DPR 3x)
- 뷰포트 메타: `width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no`
- Safe area: `env(safe-area-inset-top/bottom)` 패딩
- 높이: `100dvh` (Safari 주소창 대응)
- Canvas: 200x360 저해상도 → `image-rendering: pixelated` 업스케일

## 디자인 시스템
- 폰트: `DungGeunMo` (한글 픽셀), 폴백 `-apple-system, sans-serif`
- 색상: 슈퍼마리오 계열 팔레트 (`PALETTE` 객체, pixel-engine.js)
- 레이아웃: Canvas 전체화면 + 하단 `drawBottomGradient()` → HTML 텍스트/버튼 오버레이

## 페이지 전환
- 4개 `<section class="page">` 겹침, `.active` 클래스로 전환 (CSS opacity 0.6s)
- 전환 시: 이전 scene `stop()` → 새 scene `start()` → 500ms 후 타이핑 시작

## 타이핑 애니메이션
- JS `setInterval` 100ms/글자, `textContent`에 한 글자씩 추가
- 커서: `::after` 의사요소로 `▌` 깜빡임, `.done`일 때 제거
- 타이핑 완료 후 네비 버튼 fade-in

## 네비게이션
- 픽셀아트 화살표 SVG 버튼 (◀ 이전 / ▶ 다음)
- `.nav-row`에서 `space-between` 좌우 고정 배치, `.nav-spacer`로 빈 쪽 유지
- `pointer-events: none` (기본) → `.visible`일 때만 `pointer-events: auto`
- 1p: 우측만 / 2~3p: 양쪽 / 4p: 좌측만

## Scene 4 프랙탈 무한 줌 구현

### 원리
- 촛불 심지 색상(`#1A1620`) = 배경색과 동일 → 심지 안이 곧 배경인 착시
- 심지를 불꽃+글로우 **이후에** 그려서 반투명 블렌딩 방지
- 심지 중심(FOCUS_X, FOCUS_Y)에 CORE_R=0.4px 코어 존재

### 줌 로직
```
zoom *= ZOOM_MULTIPLIER (1.02)  // 지수적 = 체감 등속
if (zoom >= RESET_ZOOM) zoom /= RESET_ZOOM  // 심리스 리셋
```

### 내부 씬 (B레이어)
- `outerZoom >= PORTAL_VISIBLE`: 코어 안 어두운 배경 표시
- `outerZoom >= SCENE_FADE_IN`: 미니 씬 `drawSceneContent()` fade-in
- 미니 씬 스케일: `1/RESET_ZOOM` → zoom=RESET_ZOOM일 때 정확히 1:1
- 리셋 시 시각적 불연속 없음 (B가 A와 동일 크기이므로)

## 배포
- 단일 HTML 파일로 번들링 가능 (CSS/JS/이미지 인라인)
- 또는 GitHub Pages / Netlify 무료 호스팅 → 링크 공유
