#!/usr/bin/env bash
# Đo Core Web Vitals THẬT trên production (spec S13 §③.4, AC-13).
#
#   npm run cwv:prod                                  # mặc định en-vi.donghanhcungban.org, 3 lượt
#   BASE_URL=https://... RUNS=5 npm run cwv:prod
#
# CỐ Ý KHÔNG là cổng CI (§7 Q2): Lighthouse không đo được số production từ runner
# CI, và `vite preview` trên runner không phải số của người dùng thật. Chạy TAY từ
# máy có mạng tới production, rồi dán nguyên bảng vào báo cáo audit.
#
# KHÔNG cài `lighthouse` vào package.json (§① "KHÔNG LÀM": không dependency mới) —
# chạy qua `npx --yes` với phiên bản GHIM để hai lần đo so sánh được với nhau.
set -uo pipefail

LH_VERSION="12.2.1" # ghim: đổi số này là đổi thước đo, phải ghi vào báo cáo
BASE_URL="${BASE_URL:-https://en-vi.donghanhcungban.org}"
RUNS="${RUNS:-3}"

# Ba trang theo §③.1: Hôm nay · một màn học · tiến độ.
PATHS=(
  "/"
  "/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--su-roi-tu-do"
  "/tien-do"
)

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Lighthouse v${LH_VERSION} · ${BASE_URL} · ${RUNS} lượt/trang · $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo
echo "LƯU Ý: Lighthouse là phép đo LAB — nó KHÔNG đo được INP (INP là chỉ số field,"
echo "chỉ có từ người dùng thật). Cột TBT dưới đây là PROXY của INP, không phải INP."
echo

# Kiểm tra tới được production trước, để phân biệt "vượt ngưỡng" (exit 1) với
# "không đo được" (exit 2 — container phiên AI bị proxy chặn, nợ Tầng 8 từ 2026-08-25).
if ! curl -sS -o /dev/null --max-time 20 "$BASE_URL"; then
  echo "N/A — không tới được ${BASE_URL} từ máy này (mạng/proxy chặn)."
  echo "Báo cáo audit ghi N/A + lý do; goal KHÔNG được kết luận COMPLETE (§7 Q2)."
  exit 2
fi

trung_vi() { sort -g | awk '{a[NR]=$1} END{ if(NR==0){print "NA"} else if(NR%2){print a[(NR+1)/2]} else {print (a[NR/2]+a[NR/2+1])/2} }'; }

fail=0
printf '| %-56s | %8s | %10s | %6s | %s |\n' "trang" "LCP (s)" "TBT (ms)" "CLS" "kết quả"
printf '| %-56s | %8s | %10s | %6s | %s |\n' "---" "---" "---" "---" "---"

for p in "${PATHS[@]}"; do
  lcps=""; tbts=""; clss=""
  for ((i = 1; i <= RUNS; i++)); do
    out="$TMP/$(echo "$p" | tr -c 'a-zA-Z0-9' '_')-$i.json"
    if ! npx --yes "lighthouse@${LH_VERSION}" "${BASE_URL}${p}" \
      --preset=mobile --only-categories=performance \
      --output=json --output-path="$out" --quiet \
      --chrome-flags="--headless=new --no-sandbox" >/dev/null 2>&1; then
      echo "N/A — Lighthouse không chạy được cho ${p} (lượt $i)."
      exit 2
    fi
    lcps+="$(node -e "const a=require('$out').audits;console.log(a['largest-contentful-paint'].numericValue/1000)")
"
    tbts+="$(node -e "const a=require('$out').audits;console.log(a['total-blocking-time'].numericValue)")
"
    clss+="$(node -e "const a=require('$out').audits;console.log(a['cumulative-layout-shift'].numericValue)")
"
  done
  lcp=$(printf '%s' "$lcps" | grep -v '^$' | trung_vi)
  tbt=$(printf '%s' "$tbts" | grep -v '^$' | trung_vi)
  cls=$(printf '%s' "$clss" | grep -v '^$' | trung_vi)
  ok=$(node -e "const l=$lcp,t=$tbt,c=$cls;console.log(l<=2.5&&t<=200&&c<=0.1?'đạt':'VƯỢT')")
  [ "$ok" = "đạt" ] || fail=1
  printf '| %-56s | %8.2f | %10.0f | %6.3f | %s |\n' "$p" "$lcp" "$tbt" "$cls" "$ok"
done

echo
echo "Ngưỡng: LCP ≤ 2,5 s · TBT ≤ 200 ms (proxy INP) · CLS ≤ 0,1"
exit "$fail"
