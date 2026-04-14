# 미미 생일카드 - 작업 목록 (Tasks)

## Phase 1: 프로젝트 스캐폴딩
- [x] index.html 기본 구조 생성 (4페이지 섹션, 뷰포트 메타, 폰트 로드)
- [x] css/style.css 기본 스타일 (레이아웃, 페이지 전환, 레트로 테마)
- [x] js/app.js 페이지 전환 로직 + 타이핑 애니메이션 컨트롤러

## Phase 2: 픽셀 엔진 & 공용 요소
- [x] js/pixel-engine.js 공용 렌더링 유틸 (스프라이트 그리기, 이펙트)
- [x] 스프라이트 데이터 정의 (남자, 여자, 양배추, 케이크, 촛불 등) → pixel-engine.js에 포함

## Phase 3: 씬 구현 (하나씩 리뷰 후 진행)
- [x] js/scenes/scene1.js — 케이크 위의 남자 (촛불 일렁임, 손 흔들기)
- [x] js/scenes/scene2.js — 양배추 트럭 (클로즈업 연출, 눈감기, 눈물)
- [x] js/scenes/scene3.js — 양배추 피라미드 (반짝 이펙트, mimi.png 이미지 통합)
- [x] js/scenes/scene4.js — 무한 줌 타랑해 양배추 (듀얼 레이어 줌 루프) → 리뷰 대기

## Phase 4: 통합 & 폴리시
- [ ] 전체 플로우 연결 테스트 (1p→2p→3p→4p)
- [ ] 타이핑 애니메이션 타이밍 조정
- [ ] iPhone 17 Pro 뷰포트 최적화 확인
- [ ] 레트로 디자인 퀄리티 조정 (색감, 스프라이트 디테일)

## Phase 5: 배포
- [ ] 최종 테스트 (Safari 반응형 모드)
- [ ] 배포 (GitHub Pages 또는 로컬 파일)
