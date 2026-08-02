#!/usr/bin/env bash
# Usage: ./analyze_file.sh <filepath>
# Compares b34b524 (your version) vs current HEAD
# Outputs: FILE | VERDICT | REASON

set -e

FILE="$1"
BEFORE="b34b524"
REPO="/home/jimfleax/Business-Orbit-Campus-Clubs-"

if [ -z "$FILE" ]; then
  echo "Usage: $0 <filepath>"
  exit 1
fi

cd "$REPO"

# Check if file existed before merge
BEFORE_EXISTS=$(git show "${BEFORE}:${FILE}" 2>/dev/null && echo "yes" || echo "no")
AFTER_EXISTS=$([ -f "$FILE" ] && echo "yes" || echo "no")

if [ "$BEFORE_EXISTS" = "no" ] && [ "$AFTER_EXISTS" = "yes" ]; then
  echo "FILE: $FILE"
  echo "VERDICT: KEEP_MAIN_NEW"
  echo "REASON: File did not exist in your branch (b34b524), introduced by main - keep as-is"
  echo "---"
  exit 0
fi

if [ "$BEFORE_EXISTS" = "yes" ] && [ "$AFTER_EXISTS" = "no" ]; then
  echo "FILE: $FILE"
  echo "VERDICT: RESTORE_YOURS"
  echo "REASON: File existed in your branch but was deleted by the merge - needs restoration"
  echo "---"
  exit 0
fi

if [ "$BEFORE_EXISTS" = "no" ] && [ "$AFTER_EXISTS" = "no" ]; then
  echo "FILE: $FILE"
  echo "VERDICT: SKIP"
  echo "REASON: File doesn't exist in either version (may have been deleted before merge)"
  echo "---"
  exit 0
fi

# Both exist - do detailed analysis
BEFORE_CONTENT=$(git show "${BEFORE}:${FILE}" 2>/dev/null)
AFTER_CONTENT=$(cat "$FILE" 2>/dev/null)

# Check for API integration markers in BEFORE (your version)
BEFORE_API_COUNT=$(echo "$BEFORE_CONTENT" | grep -cE "(import.*Api|useContext|axiosInstance|api\.|\.get\(|\.post\(|\.put\(|\.delete\(|fetch\()" 2>/dev/null || echo "0")
# Check for API integration markers in AFTER (main/current)
AFTER_API_COUNT=$(echo "$AFTER_CONTENT" | grep -cE "(import.*Api|useContext|axiosInstance|api\.|\.get\(|\.post\(|\.put\(|\.delete\(|fetch\()" 2>/dev/null || echo "0")

# Check for hardcoded data patterns in AFTER (main)
AFTER_HARDCODED=$(echo "$AFTER_CONTENT" | grep -cE "(const.*=.*\[.*\{|dummyData|mockData|hardcoded|placeholder|TODO.*fetch|\/\/ fake|\/\/ mock)" 2>/dev/null || echo "0")

# Check if files are identical
if [ "$BEFORE_CONTENT" = "$AFTER_CONTENT" ]; then
  echo "FILE: $FILE"
  echo "VERDICT: IDENTICAL"
  echo "REASON: Files are identical in both versions"
  echo "---"
  exit 0
fi

# Count lines in each
BEFORE_LINES=$(echo "$BEFORE_CONTENT" | wc -l)
AFTER_LINES=$(echo "$AFTER_CONTENT" | wc -l)

# For frontend pages/components: check if main stripped API calls
IS_FRONTEND=$(echo "$FILE" | grep -c "^Frontend/" || echo "0")

if [ "$IS_FRONTEND" = "1" ]; then
  # Check if your version had more API calls and current has fewer (regression to hardcoded)
  if [ "$BEFORE_API_COUNT" -gt "$AFTER_API_COUNT" ] && [ "$BEFORE_API_COUNT" -gt 2 ]; then
    echo "FILE: $FILE"
    echo "VERDICT: RESTORE_YOURS"
    echo "REASON: Your version had $BEFORE_API_COUNT API calls, current has $AFTER_API_COUNT - main stripped API integration"
    echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES | BEFORE_API: $BEFORE_API_COUNT | AFTER_API: $AFTER_API_COUNT"
    echo "---"
    exit 0
  fi

  # Check if current has more hardcoded data
  if [ "$AFTER_HARDCODED" -gt 3 ] && [ "$BEFORE_API_COUNT" -gt "$AFTER_API_COUNT" ]; then
    echo "FILE: $FILE"
    echo "VERDICT: RESTORE_YOURS"
    echo "REASON: Current has $AFTER_HARDCODED hardcoded data patterns, your version had real API calls"
    echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES | BEFORE_API: $BEFORE_API_COUNT | AFTER_API: $AFTER_API_COUNT"
    echo "---"
    exit 0
  fi

  # If API counts are similar but files differ - check if main added improvements
  if [ "$AFTER_API_COUNT" -ge "$BEFORE_API_COUNT" ]; then
    echo "FILE: $FILE"
    echo "VERDICT: KEEP_MAIN"
    echo "REASON: Current version maintains or improves API integration ($BEFORE_API_COUNT -> $AFTER_API_COUNT calls), main version is OK"
    echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES | BEFORE_API: $BEFORE_API_COUNT | AFTER_API: $AFTER_API_COUNT"
    echo "---"
    exit 0
  fi

  # Edge case: both have no API calls (e.g., landing pages, static components)
  if [ "$BEFORE_API_COUNT" -le 2 ] && [ "$AFTER_API_COUNT" -le 2 ]; then
    # Prefer main if lines increased (additions/fixes), prefer yours if lines decreased significantly
    DIFF=$((AFTER_LINES - BEFORE_LINES))
    if [ "$DIFF" -gt 20 ]; then
      echo "FILE: $FILE"
      echo "VERDICT: KEEP_MAIN"
      echo "REASON: Static component with $DIFF more lines in main - likely improvements/fixes added"
      echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES"
      echo "---"
    elif [ "$DIFF" -lt -30 ]; then
      echo "FILE: $FILE"
      echo "VERDICT: MANUAL_REVIEW"
      echo "REASON: Static component - main version is $((DIFF * -1)) lines shorter, may have lost content"
      echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES"
      echo "---"
    else
      echo "FILE: $FILE"
      echo "VERDICT: KEEP_MAIN"
      echo "REASON: Static component with minor changes, keep main version"
      echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES"
      echo "---"
    fi
    exit 0
  fi

  # Fallback for frontend
  echo "FILE: $FILE"
  echo "VERDICT: MANUAL_REVIEW"
  echo "REASON: Unclear verdict - BEFORE_API=$BEFORE_API_COUNT AFTER_API=$AFTER_API_COUNT HARDCODED=$AFTER_HARDCODED"
  echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES"
  echo "---"
else
  # Backend file analysis
  # Check if your backend version had more logic (likely your working code)
  if [ "$BEFORE_LINES" -gt "$((AFTER_LINES * 2))" ]; then
    echo "FILE: $FILE"
    echo "VERDICT: RESTORE_YOURS"
    echo "REASON: Backend - your version has $BEFORE_LINES lines vs $AFTER_LINES in current (likely main deleted/emptied your work)"
    echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES"
    echo "---"
  elif [ "$AFTER_LINES" -gt "$((BEFORE_LINES * 2))" ]; then
    echo "FILE: $FILE"
    echo "VERDICT: KEEP_MAIN"
    echo "REASON: Backend - main version has $AFTER_LINES lines vs your $BEFORE_LINES (main added more functionality)"
    echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES"
    echo "---"
  else
    echo "FILE: $FILE"
    echo "VERDICT: MANUAL_REVIEW"
    echo "REASON: Backend - similar sizes, needs manual review"
    echo "BEFORE_LINES: $BEFORE_LINES | AFTER_LINES: $AFTER_LINES"
    echo "---"
  fi
fi
