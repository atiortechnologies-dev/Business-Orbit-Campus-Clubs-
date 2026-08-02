#!/usr/bin/env bash
# Runs analyze_file.sh on all changed Frontend files and saves results
# Usage: ./run_frontend_analysis.sh

REPO="/home/jimfleax/Business-Orbit-Campus-Clubs-"
SCRIPT="$REPO/scratch/analyze_file.sh"
OUTPUT="$REPO/scratch/analysis_results.txt"
chmod +x "$SCRIPT"

echo "=== MERGE ANALYSIS RESULTS ===" > "$OUTPUT"
echo "Before commit: b34b524 (your version)" >> "$OUTPUT"
echo "After: HEAD (post-merge with main)" >> "$OUTPUT"
echo "Merge commit: f96cc51" >> "$OUTPUT"
echo "Date: $(date)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

TOTAL=0
RESTORE_YOURS=0
KEEP_MAIN=0
KEEP_MAIN_NEW=0
IDENTICAL=0
MANUAL=0

# Frontend files
echo "=== FRONTEND FILES ===" >> "$OUTPUT"
while IFS= read -r file; do
  file=$(echo "$file" | tr -d '\r')
  [ -z "$file" ] && continue
  RESULT=$("$SCRIPT" "$file" 2>/dev/null)
  echo "$RESULT" >> "$OUTPUT"
  
  VERDICT=$(echo "$RESULT" | grep "^VERDICT:" | awk '{print $2}')
  case "$VERDICT" in
    RESTORE_YOURS) RESTORE_YOURS=$((RESTORE_YOURS+1)) ;;
    KEEP_MAIN) KEEP_MAIN=$((KEEP_MAIN+1)) ;;
    KEEP_MAIN_NEW) KEEP_MAIN_NEW=$((KEEP_MAIN_NEW+1)) ;;
    IDENTICAL) IDENTICAL=$((IDENTICAL+1)) ;;
    MANUAL_REVIEW) MANUAL=$((MANUAL+1)) ;;
  esac
  TOTAL=$((TOTAL+1))
done < /tmp/frontend_changed.txt

# Backend files  
echo "" >> "$OUTPUT"
echo "=== BACKEND FILES ===" >> "$OUTPUT"
while IFS= read -r file; do
  file=$(echo "$file" | tr -d '\r')
  [ -z "$file" ] && continue
  RESULT=$("$SCRIPT" "$file" 2>/dev/null)
  echo "$RESULT" >> "$OUTPUT"
  
  VERDICT=$(echo "$RESULT" | grep "^VERDICT:" | awk '{print $2}')
  case "$VERDICT" in
    RESTORE_YOURS) RESTORE_YOURS=$((RESTORE_YOURS+1)) ;;
    KEEP_MAIN) KEEP_MAIN=$((KEEP_MAIN+1)) ;;
    KEEP_MAIN_NEW) KEEP_MAIN_NEW=$((KEEP_MAIN_NEW+1)) ;;
    IDENTICAL) IDENTICAL=$((IDENTICAL+1)) ;;
    MANUAL_REVIEW) MANUAL=$((MANUAL+1)) ;;
  esac
  TOTAL=$((TOTAL+1))
done < /tmp/backend_changed.txt

echo "" >> "$OUTPUT"
echo "=== SUMMARY ===" >> "$OUTPUT"
echo "Total files analyzed: $TOTAL" >> "$OUTPUT"
echo "RESTORE_YOURS (revert to your version): $RESTORE_YOURS" >> "$OUTPUT"
echo "KEEP_MAIN (keep main version): $KEEP_MAIN" >> "$OUTPUT"
echo "KEEP_MAIN_NEW (new file from main): $KEEP_MAIN_NEW" >> "$OUTPUT"
echo "IDENTICAL (no action needed): $IDENTICAL" >> "$OUTPUT"
echo "MANUAL_REVIEW (needs human review): $MANUAL" >> "$OUTPUT"

echo "Analysis complete! Results in: $OUTPUT"
echo "Summary: RESTORE=$RESTORE_YOURS KEEP_MAIN=$KEEP_MAIN NEW=$KEEP_MAIN_NEW IDENTICAL=$IDENTICAL MANUAL=$MANUAL"
