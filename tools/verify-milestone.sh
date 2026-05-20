#!/usr/bin/env bash
# verify-milestone.sh · 验证单个里程碑或全部 Goal 事实
# 用法：
#   ./tools/verify-milestone.sh <里程碑名>     · 验单个
#   ./tools/verify-milestone.sh --all          · 验全部 10 条 Goal 事实

set -u

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

GH_REPO="mahaiting-glitch/mono2026-sandbox"
PASS=0
FAIL=0
declare -a RESULTS

check() {
  local name="$1"
  local cond="$2"
  if eval "$cond" > /dev/null 2>&1; then
    RESULTS+=("PASS · $name")
    PASS=$((PASS + 1))
  else
    RESULTS+=("FAIL · $name")
    FAIL=$((FAIL + 1))
  fi
}

if [ "${1:-}" = "--all" ]; then
  # 10 条 Goal 事实
  check "1 · constitution.md 存在且 ≥5 MUST" \
    "[ -f .milestone/constitution.md ] && [ \$(grep -c '^### MUST-' .milestone/constitution.md) -ge 5 ]"

  check "2 · 6 个 skill 目录 + SKILL.md" \
    "for s in specify clarify tech check tasks impl; do [ -f .claude/skills/milestone-\$s/SKILL.md ] || exit 1; done"

  check "3 · verify-milestone.sh 存在且可执行" \
    "[ -x tools/verify-milestone.sh ]"

  check "4 · 5 个里程碑目录" \
    "[ -d 里程碑/001-按日期排序 ] && [ -d 里程碑/002-排序方向切换 ] && [ -d 里程碑/003-标签筛选 ] && [ -d 里程碑/004-排序+筛选组合 ] && [ -d 里程碑/005-sortBy\\ API\\ 重构 ]"

  check "5 · 每个里程碑 5 个产物" \
    "for m in 里程碑/*/; do for f in spec.md plan.md analyze.md tasks.md ratification.md; do [ -f \"\$m\$f\" ] || exit 1; done; done"

  check "6 · ≥10 条 approved by commit" \
    "[ \$(git log --grep='approved by 李庆\\|approved by 马海艇' --oneline | wc -l) -ge 10 ]"

  check "7 · 004 analyze.md 含 HIGH" \
    "grep -q 'HIGH' 里程碑/004-排序+筛选组合/analyze.md"

  check "8 · 005 analyze.md 含 CRITICAL + PAUSE_FLAG 历史" \
    "grep -q 'CRITICAL' 里程碑/005-sortBy\\ API\\ 重构/analyze.md && grep -q 'PAUSE_FLAG' .claude/pause-log 2>/dev/null"

  check "9 · gh issue + PR 全 closed/merged" \
    "[ \$(gh issue list -R $GH_REPO --state open --limit 100 | wc -l) -eq 0 ] && [ \$(gh pr list -R $GH_REPO --state open --limit 100 | wc -l) -eq 0 ]"

  check "10 · retrospect.md ≥3 改进点" \
    "[ -f retrospect.md ] && [ \$(grep -cE '^[0-9]+、|^- ' retrospect.md) -ge 3 ]"

  echo ""
  echo "================================"
  printf '%s\n' "${RESULTS[@]}"
  echo "================================"
  echo "PASS: $PASS / 10    FAIL: $FAIL"
  [ "$FAIL" -eq 0 ] && exit 0 || exit 1
fi

# 单个里程碑验证
NAME="${1:-}"
if [ -z "$NAME" ]; then
  echo "用法: $0 <里程碑名> 或 $0 --all"
  exit 2
fi

DIR="里程碑/$NAME"
[ ! -d "$DIR" ] && { echo "FAIL · 目录不存在: $DIR"; exit 1; }

check "spec.md" "[ -f '$DIR/spec.md' ]"
check "plan.md" "[ -f '$DIR/plan.md' ]"
check "analyze.md" "[ -f '$DIR/analyze.md' ]"
check "tasks.md" "[ -f '$DIR/tasks.md' ]"
check "ratification.md" "[ -f '$DIR/ratification.md' ]"
check "spec approved by 李庆" "git log --grep='$NAME.*approved by 李庆' --oneline | head -1 | grep -q ."
check "plan approved by 马海艇" "git log --grep='$NAME.*approved by 马海艇' --oneline | head -1 | grep -q ."

echo ""
printf '%s\n' "${RESULTS[@]}"
echo "PASS: $PASS    FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
