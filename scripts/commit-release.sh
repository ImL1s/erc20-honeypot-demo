#!/bin/bash
# 自動提交發佈準備的所有更改

set -e  # 遇到錯誤立即停止

echo "🚀 準備提交發佈更改..."
echo ""

# 顯示將要提交的文件
echo "📋 將要提交的文件："
git status -s
echo ""

# 確認是否繼續
read -p "❓ 確定要提交這些更改嗎？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消提交"
    exit 0
fi

echo ""
echo "📦 添加文件到暫存區..."

# 添加新增和修改的文件
git add LICENSE
git add SECURITY.md
git add README.md
git add package.json
git add .gitignore
git add .env.example
git add scripts/pre-release-check.sh

# 添加項目文件（如果有更改）
git add app/page.tsx 2>/dev/null || true
git add components/WalletPanel.tsx 2>/dev/null || true
git add contracts/PixiuToken.sol 2>/dev/null || true
git add lib/contract.ts 2>/dev/null || true
git add test/PixiuToken.ts 2>/dev/null || true

# 刪除 firebase-debug.log
git rm --cached firebase-debug.log 2>/dev/null || git add firebase-debug.log 2>/dev/null || true

echo "✅ 文件添加完成"
echo ""

# 創建提交
echo "📝 創建提交..."
git commit -m "chore: prepare for public release

- Add MIT LICENSE
- Add SECURITY.md with security guidelines
- Update README with quick start options and deployed contract info
- Improve .env.example with detailed documentation
- Update .gitignore to exclude debug logs and test results
- Add pre-release security check script
- Remove firebase-debug.log from repository"

echo ""
echo "✅ 提交成功！"
echo ""

# 顯示提交信息
echo "📊 提交詳情："
git log -1 --stat
echo ""

# 詢問是否推送
read -p "🚀 要立即推送到 GitHub 嗎？(y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 推送到 GitHub..."
    git push origin main
    echo ""
    echo "🎉 成功！項目已發佈到 GitHub！"
else
    echo "ℹ️  稍後可以使用以下命令推送："
    echo "   git push origin main"
fi

echo ""
echo "✨ 完成！"
