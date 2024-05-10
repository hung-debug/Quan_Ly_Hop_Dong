pipeline {
    agent any
    tools {nodejs "node_14_21_3"}
    stages {
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
                    sh 'npm install'
                    sh 'cp libs/angular/common.d.ts node_modules/@angular/common'
                    sh 'cp libs/interactjs/index.d.ts node_modules/@interactjs/types'
                    sh 'cp libs/lodash/common.d.ts node_modules/@types/lodash/common'

                    sh 'npm run build'
                    sh 'cp -r dist/eContract-web builds/'
                    dir("builds"){
                      sh 'ls -l'
                    }
                }
                echo '----------------------Build done----------------------'
            }
        }
    }
}
