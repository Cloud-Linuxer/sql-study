#!/bin/bash
# 대용량 CSV 데이터 임포트 스크립트
# 사용법: ./import-data.sh /path/to/store_data.csv

set -e

CSV_FILE=${1:-"store_data.csv"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"3306"}
DB_USER=${DB_USER:-"root"}
DB_PASSWORD=${DB_PASSWORD:-"practice123"}
DB_NAME=${DB_NAME:-"naver_financial"}

if [ ! -f "$CSV_FILE" ]; then
    echo "❌ CSV 파일을 찾을 수 없습니다: $CSV_FILE"
    echo "사용법: ./import-data.sh /path/to/store_data.csv"
    exit 1
fi

echo "📦 데이터 임포트 시작..."
echo "   파일: $CSV_FILE"
echo "   DB: $DB_NAME@$DB_HOST:$DB_PORT"

# MySQL 접속 테스트
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ MySQL 연결 실패"
    exit 1
fi

echo "✅ MySQL 연결 성공"

# 기존 데이터 삭제 (옵션)
read -p "기존 데이터를 삭제하시겠습니까? (y/N): " confirm
if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    echo "🗑️  기존 데이터 삭제 중..."
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "TRUNCATE TABLE stores;"
fi

# CSV 임포트 (LOAD DATA LOCAL INFILE 사용)
echo "📥 CSV 임포트 중... (약 5-10분 소요)"

mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" --local-infile=1 "$DB_NAME" << EOF
SET GLOBAL local_infile = 1;

LOAD DATA LOCAL INFILE '$CSV_FILE'
INTO TABLE stores
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(col1, col2, col3, col4, col5, col6, col7, col8, col9, col10,
 col11, col12, col13, col14, col15, col16, col17, col18, col19, col20,
 col21, col22, col23, col24, col25, col26, col27, col28, col29, col30,
 col31, col32, col33, col34, col35, col36, col37, @col38, @col39)
SET col38 = NULLIF(@col38, ''),
    col39 = NULLIF(@col39, '');
EOF

# 결과 확인
COUNT=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -N -e "SELECT COUNT(*) FROM stores;")

echo ""
echo "✅ 데이터 임포트 완료!"
echo "   총 레코드 수: $COUNT"
