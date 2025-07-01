def pathInServer = "/u01/app"
def patheContractDev = "/u01/app/eContract-web"
def message = "*Start build Front-end eContract KD*"
def groupEChatWorkId = "65f95fbcd49bf204c8d6eb9b"
pipeline {
    agent any
     environment {
         ACCOUNT_SSH = credentials('eContract_FE_KD_user_pass')
         SSH_HOST = credentials('eContract_FE_KD_host')
     }
    tools {nodejs "node_14_21_3"}
    stages {
        stage("Get all commit") {
              steps {
                    echo '----------------------Start get all commit----------------------'
                    script {
                           def changeLogSets = currentBuild.changeSets
                           for (int i = 0; i < changeLogSets.size(); i++) {
                               def entries = changeLogSets[i].items
                               for (int j = 0; j < entries.length; j++) {
                                   def entry = entries[j]
                                   message += "\\n- ${entry.msg}"
                               }
                           }
                    }
              }
        }
        stage("Build"){
            steps {
                echo '----------------------Start build----------------------'
                sh """
                   curl -X POST -H "Content-Type: application/json"  -H "x-api-key: AoOK0GLBh+sKwwH1jPAqTV+4ktUbMdxmJ/ly/lNZ168=" -d '{"listGroup": ["${groupEChatWorkId}"],"announcement": "${message}"}' https://ottchat.mobifone.vn/chat_engine/general/push_announcement/group
                """
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
                    sh '''
						echo "Check TypeScript version"
						npx tsc -v

						echo "Clean install dependencies"
						rm -rf node_modules package-lock.json
						npm cache clean --force
						npm install

						echo "Copy custom typings"
						cp libs/angular/common.d.ts node_modules/@angular/common
						cp libs/interactjs/index.d.ts node_modules/@interactjs/types
						cp libs/lodash/common.d.ts node_modules/@types/lodash/common

						echo "Build Angular app"
						npx ng build --configuration production
					'''
                    sh 'cp -r dist/eContract-web builds/'
                    dir("builds"){
                      sh 'ls -l'
                    }
                }
                echo '----------------------Build done----------------------'
            }
        }
        stage("Deploy"){
            steps{
                script{
                    def remote = [:]
                    remote.name = 'eContract_FE_KD'
                    remote.host = SSH_HOST
                    remote.allowAnyHosts = true
                    remote.user = ACCOUNT_SSH_USR
                    remote.password = ACCOUNT_SSH_PSW
                    echo "-------------------Start deploy-------------------"

                    echo "-------------------Start run backup.sh-------------------"
                    sshCommand remote: remote, command: "cd ${pathInServer}/script_deploy ; ./backup.sh"
                    echo "-------------------Run backup.sh done-------------------"

                    echo "-------------------Start push file to server-------------------"
                    sshPut remote: remote, from: 'builds/eContract-web/.', into: "${pathInServer}"
                    echo "-------------------Push file to server done-------------------"

                    sh """
                      curl -X POST -H "Content-Type: application/json"  -H "x-api-key: AoOK0GLBh+sKwwH1jPAqTV+4ktUbMdxmJ/ly/lNZ168=" -d '{"listGroup": ["${groupEChatWorkId}"],"announcement": "Hoàn thành deploy Front-end eContract KD. Truy cập link https://mobifone-econtract.vn để test"}' https://ottchat.mobifone.vn/chat_engine/general/push_announcement/group

                    """
                    echo "-------------------Deploy done-------------------"
                }
            }
        }
    }
}
