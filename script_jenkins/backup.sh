#!/bin/bash
backup_prefix="bak"
today=$(date +%Y%m%d)
backup_path="${backup_prefix}_${today}"
if [ -d /u01/app/${backup_path} ]; then
  echo "Directory backup ${backup_path} exists"
else
  echo "Create Directory backup ${backup_path}"
  mkdir /u01/app/${backup_path}
fi
# Directory containing the files
directory="/u01/app/eContract-web-vmec"

cp -a /u01/app/eContract-web-vmec/. $backup_path/
