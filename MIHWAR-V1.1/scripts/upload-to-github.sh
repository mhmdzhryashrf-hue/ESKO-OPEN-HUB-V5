#!/usr/bin/env bash
set -Eeuo pipefail

# Upload MIHWAR V1.1 into the existing ESKO repository on a new branch.
# Credentials are requested interactively and are not written to the repository.
REPO_URL="https://github.com/mhmdzhryashrf-hue/ESKO-OPEN-HUB-V5.git"
REPO_NAME="ESKO-OPEN-HUB-V5"
BRANCH="mihwar-v1.1-upload-$(date +%Y%m%d-%H%M%S)"
DEST_DIR="MIHWAR-V1.1"

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_ROOT="$(mktemp -d)"
ASKPASS="$TMP_ROOT/askpass.sh"
cleanup() {
  unset GITHUB_USERNAME GITHUB_TOKEN 2>/dev/null || true
  rm -rf "$TMP_ROOT"
}
trap cleanup EXIT

printf '\n=== رفع MIHWAR V1.1 إلى مستودع ESKO ===\n'
read -r -p 'اسم مستخدم GitHub: ' GITHUB_USERNAME
if [[ -z "$GITHUB_USERNAME" ]]; then
  echo 'خطأ: اسم المستخدم فارغ.' >&2; exit 1
fi
read -r -s -p 'GitHub Token: ' GITHUB_TOKEN
printf '\n'
if [[ -z "$GITHUB_TOKEN" ]]; then
  echo 'خطأ: التوكن فارغ.' >&2; exit 1
fi
export GITHUB_USERNAME GITHUB_TOKEN

cat > "$ASKPASS" <<'ASKPASS_EOF'
#!/usr/bin/env bash
case "$1" in
  *sername*) printf '%s\n' "$GITHUB_USERNAME" ;;
  *assword*) printf '%s\n' "$GITHUB_TOKEN" ;;
  *) printf '\n' ;;
esac
ASKPASS_EOF
chmod 700 "$ASKPASS"
export GIT_ASKPASS="$ASKPASS"
export GIT_TERMINAL_PROMPT=0

printf '\n[1/5] الاتصال بالمستودع...\n'
git clone --depth 1 "$REPO_URL" "$TMP_ROOT/repo"
cd "$TMP_ROOT/repo"

printf '[2/5] إنشاء فرع مستقل: %s\n' "$BRANCH"
git switch -c "$BRANCH"

if [[ -e "$DEST_DIR" ]]; then
  echo "خطأ: المسار $DEST_DIR موجود بالفعل في المستودع؛ أوقفت الرفع لحماية الملفات الحالية." >&2
  exit 1
fi

printf '[3/5] نسخ ملفات MIHWAR V1.1...\n'
mkdir -p "$DEST_DIR"
# Copy the complete project, excluding repository metadata if present.
cp -a "$SOURCE_DIR"/. "$DEST_DIR"/
rm -rf "$DEST_DIR/.git"

printf '[4/5] تجهيز commit...\n'
git add "$DEST_DIR"
if git diff --cached --quiet; then
  echo 'لا توجد تغييرات جديدة لرفعها.'
  exit 0
fi
git -c user.name="$GITHUB_USERNAME" -c user.email="${GITHUB_USERNAME}@users.noreply.github.com" \
  commit -m "Add MIHWAR V1.1 implementation package"

printf '[5/5] رفع الفرع إلى GitHub...\n'
git push -u origin "$BRANCH"

printf '\nتم رفع الملفات بنجاح إلى الفرع: %s\n' "$BRANCH"
printf 'رابط المستودع: https://github.com/mhmdzhryashrf-hue/%s/tree/%s/%s\n' "$REPO_NAME" "$BRANCH" "$DEST_DIR"
printf 'لم يتم تعديل فرع main.\n'
