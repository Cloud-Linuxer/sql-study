# 구글 로그인 설정 가이드

## 1. Google Cloud Console 설정

### 1단계: 프로젝트 생성
1. https://console.cloud.google.com/ 접속
2. 새 프로젝트 생성 (예: "라니 SQL Practice")

### 2단계: OAuth 동의 화면 설정
1. 왼쪽 메뉴 → "APIs & Services" → "OAuth consent screen"
2. User Type: External 선택
3. 앱 정보 입력:
   - App name: 라니를 위한 쿼리테스트 플랫폼
   - User support email: 본인 이메일
   - Developer contact: 본인 이메일
4. Scopes 추가:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Test users 추가 (개발 중에는 본인 이메일)

### 3단계: OAuth 클라이언트 ID 생성
1. "Credentials" → "Create Credentials" → "OAuth client ID"
2. Application type: Web application
3. 이름: SQL Practice Web Client
4. Authorized redirect URIs 추가:
   ```
   http://localhost:3001/auth/google/callback
   https://your-cloudflare-url.trycloudflare.com/auth/google/callback
   ```
5. "Create" 클릭
6. **Client ID**와 **Client Secret** 복사

## 2. 서버 설정

### .env 파일 수정
`/home/sql/server/.env` 파일을 열어서:

```env
GOOGLE_CLIENT_ID=복사한_클라이언트_ID
GOOGLE_CLIENT_SECRET=복사한_시크릿
SESSION_SECRET=랜덤한_비밀키_생성
CALLBACK_URL=http://localhost:3001/auth/google/callback
```

### 서버 재시작
```bash
cd /home/sql
pkill -f "node.*server"
cd server && NODE_OPTIONS="--max-old-space-size=8192" node server.js &
```

## 3. 테스트

브라우저에서:
1. http://localhost:3001/auth/google 접속
2. 구글 계정 선택
3. 권한 승인
4. 메인 페이지로 리다이렉트
5. 로그인 완료!

## 4. 로깅 기능

### 자동 로깅
- 모든 쿼리가 자동으로 `query_logs` 테이블에 저장됨
- 로그인한 사용자만 본인의 로그 확인 가능

### 로그 조회
```bash
curl http://localhost:3001/api/logs
```

### 통계 조회
```bash
curl http://localhost:3001/api/stats
```

## 5. 데이터베이스 구조

### users 테이블
- id: 사용자 ID
- google_id: 구글 ID (고유)
- email: 이메일
- name: 이름
- profile_picture: 프로필 사진 URL
- created_at: 가입일
- last_login: 마지막 로그인

### query_logs 테이블
- id: 로그 ID
- user_id: 사용자 ID
- query_text: 실행한 쿼리
- execution_time: 실행 시간 (ms)
- row_count: 반환된 행 수
- success: 성공 여부
- error_message: 에러 메시지 (실패 시)
- created_at: 실행 시각

## 6. API 엔드포인트

### 인증
- `GET /auth/google` - 구글 로그인 시작
- `GET /auth/google/callback` - 로그인 콜백
- `GET /auth/logout` - 로그아웃
- `GET /api/user` - 현재 사용자 정보

### 로깅
- `GET /api/logs?limit=50` - 쿼리 히스토리 (최근 50개)
- `GET /api/stats` - 사용자 통계

### 쿼리 (기존)
- `POST /api/query` - 쿼리 실행 (자동 로깅)
- `GET /api/schema` - 테이블 스키마
- `GET /api/sample/:column` - 샘플 데이터
