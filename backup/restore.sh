#!/bin/bash
# MySQL 데이터베이스 복원 스크립트

echo "🔄 데이터베이스 복원 시작..."

# 백업 파일 확인
if [ ! -f "/home/sql/backup/stores_complete.sql.gz" ]; then
    echo "❌ 백업 파일이 없습니다!"
    exit 1
fi

# 기존 테이블 삭제 (있다면)
docker exec sql-practice-mysql mysql -uroot -ppractice123 naver_financial -e "DROP TABLE IF EXISTS stores;" 2>&1 | grep -v Warning

# 백업 복원
echo "📥 데이터 복원 중..."
zcat /home/sql/backup/stores_complete.sql.gz | docker exec -i sql-practice-mysql mysql -uroot -ppractice123 naver_financial

# 확인
TOTAL=$(docker exec sql-practice-mysql mysql -uroot -ppractice123 naver_financial -e "SELECT COUNT(*) as total FROM stores;" 2>&1 | grep -v Warning | tail -1)

echo "✅ 복원 완료!"
echo "📊 총 데이터: $TOTAL 건"
