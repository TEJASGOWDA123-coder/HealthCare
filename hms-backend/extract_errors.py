
import sys

log_file = sys.argv[1]
with open(log_file, 'r', encoding='utf-16') as f: # Try UTF-16 first since PowerShell often uses it
    lines = f.readlines()

for i, line in enumerate(lines):
    if "ERROR" in line or "Exception" in line or "Caused by" in line:
        print(f"Line {i+1}: {line.strip()}")
        # Print next 5 lines for context
        for j in range(1, 6):
            if i + j < len(lines):
                print(f"  {lines[i+j].strip()}")
