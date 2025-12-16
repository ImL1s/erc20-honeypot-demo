#!/bin/bash
# 發佈前安全檢查腳本

echo "🔍 開始執行發佈前安全檢查..."
echo ""

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. 檢查 .env 是否被 gitignore
echo "📋 檢查 1: .env 文件是否在 .gitignore 中..."
if grep -q "^\.env$" .gitignore; then
    echo -e "${GREEN}✓ .env 已在 .gitignore 中${NC}"
else
    echo -e "${RED}✗ 錯誤: .env 未在 .gitignore 中！${NC}"
    ((ERRORS++))
fi

# 2. 檢查 .env 是否被追蹤
echo "📋 檢查 2: .env 文件是否被 Git 追蹤..."
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo -e "${RED}✗ 錯誤: .env 文件被 Git 追蹤！請執行: git rm --cached .env${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ .env 未被 Git 追蹤${NC}"
fi

# 3. 檢查歷史記錄中是否有 .env
echo "📋 檢查 3: Git 歷史中是否包含 .env..."
if git log --all --full-history --source -- .env 2>/dev/null | grep -q "commit"; then
    echo -e "${YELLOW}⚠ 警告: Git 歷史中曾經包含 .env 文件！${NC}"
    echo -e "${YELLOW}  建議使用 BFG Repo-Cleaner 清理歷史: https://rtyley.github.io/bfg-repo-cleaner/${NC}"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓ Git 歷史中無 .env 記錄${NC}"
fi

# 4. 檢查代碼中是否有硬編碼的私鑰
echo "📋 檢查 4: 源碼中是否有硬編碼私鑰..."
FOUND_KEYS=$(grep -r "0x[a-fA-F0-9]\{64\}" \
    --include="*.ts" --include="*.tsx" --include="*.js" \
    --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=typechain-types --exclude-dir=artifacts \
    --exclude="*.tsbuildinfo" --exclude=".env*" \
    . 2>/dev/null | \
    grep -v "YOUR_PRIVATE_KEY" | \
    grep -v "0x0000000000000000000000000000000000000000000000000000000000000000" | \
    grep -v "example" | \
    grep -v "bytecode" || true)

if [ -n "$FOUND_KEYS" ]; then
    echo -e "${RED}✗ 錯誤: 發現可能的硬編碼私鑰！${NC}"
    echo "$FOUND_KEYS"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ 未發現硬編碼私鑰${NC}"
fi

# 5. 檢查 LICENSE 文件
echo "📋 檢查 5: LICENSE 文件是否存在..."
if [ -f "LICENSE" ]; then
    echo -e "${GREEN}✓ LICENSE 文件存在${NC}"
else
    echo -e "${RED}✗ 錯誤: 缺少 LICENSE 文件${NC}"
    ((ERRORS++))
fi

# 6. 檢查 .env.example 是否存在
echo "📋 檢查 6: .env.example 文件是否存在..."
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓ .env.example 文件存在${NC}"
else
    echo -e "${YELLOW}⚠ 警告: 缺少 .env.example 文件${NC}"
    ((WARNINGS++))
fi

# 7. 檢查 README 是否包含安全提醒
echo "📋 檢查 7: README 是否包含安全提醒..."
if grep -q "安全提醒\|Security\|SECURITY.md" README.md; then
    echo -e "${GREEN}✓ README 包含安全提醒${NC}"
else
    echo -e "${YELLOW}⚠ 警告: README 缺少安全提醒${NC}"
    ((WARNINGS++))
fi

# 8. 檢查當前 .env 中的私鑰格式
echo "📋 檢查 8: .env 中的私鑰是否為示例格式..."
if [ -f ".env" ]; then
    if grep -q "DEPLOYER_KEY=0x[a-fA-F0-9]\{64\}" .env; then
        if ! grep -q "YOUR_PRIVATE_KEY" .env; then
            echo -e "${YELLOW}⚠ 警告: .env 中包含真實格式的私鑰！${NC}"
            echo -e "${YELLOW}  請確認此私鑰僅用於測試網，且錢包無真實資金${NC}"
            ((WARNINGS++))
        fi
    fi
fi

# 9. 檢查未提交的更改
echo "📋 檢查 9: 是否有未提交的更改..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠ 提示: 存在未提交的文件更改${NC}"
    git status -s
    ((WARNINGS++))
else
    echo -e "${GREEN}✓ 工作目錄乾淨${NC}"
fi

# 總結
echo ""
echo "================================"
echo "📊 檢查完成！"
echo "================================"
echo -e "錯誤: ${RED}${ERRORS}${NC}"
echo -e "警告: ${YELLOW}${WARNINGS}${NC}"

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo -e "${RED}❌ 發現 ${ERRORS} 個錯誤，請修復後再發佈！${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  發現 ${WARNINGS} 個警告，建議檢查後再發佈${NC}"
    exit 0
else
    echo ""
    echo -e "${GREEN}✅ 所有檢查通過！項目可以安全發佈${NC}"
    exit 0
fi
