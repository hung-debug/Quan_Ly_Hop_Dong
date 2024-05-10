def pathInServer = "/u01/app"
def message = "*[Start build eContract FE dev]*\n"
pipeline {
    agent any
     environment {
         ACCOUNT_SSH = credentials('eContract_FE_dev_user_pass')
         SSH_HOST = credentials('eContract_FE_dev_host')
     }
    tools {nodejs "node_14_21_3"}
    stages {
        stage("Push notification") {
              steps {
                    script {
                           def changeLogSets = currentBuild.changeSets
                           for (int i = 0; i < changeLogSets.size(); i++) {
                               def entries = changeLogSets[i].items
                               for (int j = 0; j < entries.length; j++) {
                                   def entry = entries[j]
                                   echo "${entry.msg} \n"
                                   message += "${entry.msg} \n"
                               }
                           }
                           echo "===================message: ${message}====================="

                           sh """
                              echo "===================message: ${message}====================="
                           """
                    }
              }
        }
        stage("Build"){
            steps {
                echo '----------------------Start build----------------------'
                sh 'pwd'
                sh 'ls -l'
                sh 'test -d "builds/" && echo "Exist folder builds" || mkdir builds'
                sh '''
                    if [ -n "$(ls -A builds/)" ]; then
                        echo "Clean build"
                        rm -r builds/*
                    else
                        echo "Folder builds is empty"
                    fi
                '''
                dir("builds"){
                    sh 'ls -l'
                }
                script {
                    sh 'node -v'
                    sh 'npm -v'
//                     sh 'npm install'
//                     sh 'cp libs/angular/common.d.ts node_modules/@angular/common'
//                     sh 'cp libs/interactjs/index.d.ts node_modules/@interactjs/types'
//                     sh 'cp libs/lodash/common.d.ts node_modules/@types/lodash/common'
//
//                     sh 'npm run build'
//                     sh 'cp -r dist/eContract-web builds/'
//                     dir("builds"){
//                       sh 'ls -l'
//                     }
                }
                echo '----------------------Build done----------------------'
            }
        }
//         stage("Deploy"){
//             steps{
//                 script{
//                     def remote = [:]
//                     remote.name = 'eContract_FE_dev'
//                     remote.host = SSH_HOST
//                     remote.allowAnyHosts = true
//                     remote.user = ACCOUNT_SSH_USR
//                     remote.password = ACCOUNT_SSH_PSW
//                     echo "-------------------Start deploy-------------------"
//
//                     echo "-------------------Start run backup.sh-------------------"
//                     sshCommand remote: remote, command: "cd ${pathInServer}/script_deploy ; ./backup.sh"
//                     echo "-------------------Run backup.sh done-------------------"
//
//                     echo "-------------------Start push file to server-------------------"
// //                     sshPut remote: remote, from: 'builds/eContract-web/.', into: "${pathInServer}/"
//                     echo "-------------------Push file to server done-------------------"
//
//                     sh '''
//                       curl -X POST -H "Content-Type: application/json"  -H "x-api-key: AoOK0GLBh+sKwwH1jPAqTV+4ktUbMdxmJ/ly/lNZ168=" -d '{"receivers": [{"email": "quyen.nguyenhuu@mobifone.vn"},{"email": "dat.trinhtien10@mobifone.vn"},{"email": "duong.nguyenhuu@mobifone.vn"},{"email": "thao.phamthi10@mobifone.vn"},{"email": "ha.nguyendo10@mobifone.vn"},{"email": "tu.lehuuanh10@mobifone.vn"},{"email": "truong.vuongtat@mobifone.vn"},{"email": "hong.phamthu@mobifone.vn"},{"email": "vu.vuongtat@mobifone.vn"},{"email": "anh.nguyenkim@mobifone.vn"},{"email": "anh.vunam@mobifone.vn"},{"email": "ha.danghoang@mobifone.vn"},{"email": "khang.buithe10@mobifone.vn"}],"announcement": "Build eContract FE dev done"}' https://ottchat.mobifone.vn/chat_engine/general/push_announcement
//
//                     '''
//                     echo "-------------------Deploy done-------------------"
//                 }
//             }
//         }
    }
}
