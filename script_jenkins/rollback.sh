#!/bin/bash
backup_prefix="bak"
today=$(date +%Y%m%d)
backup_path="${backup_prefix}_${today}"
directory="/u01/app/eContract-web-vmec"
if [ -d /u01/app/${backup_path} ]; then
  echo "Directory backup ${backup_path} exists"
  cp -a $backup_path/.  /u01/app/eContract-web-vmec/
fi
