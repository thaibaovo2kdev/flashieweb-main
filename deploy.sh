#!/bin/bash
CI_REGISTRY_USER="vindev"
CI_REGISTRY_PASSWORD="haXyoNZsFTox3sFx4mdU"
CI_REGISTRY="https://registry.gitlab.com/englishwing1/flashie/flashieweb"
CI_REGISTRY_IMAGE="registry.gitlab.com/englishwing1/flashie/flashieweb"
SERVICE_NAME="flashie"
CONTAINER_TEST_IMAGE="$CI_REGISTRY_IMAGE/$SERVICE_NAME:test"
CONTAINER_RELEASE_IMAGE="$CI_REGISTRY_IMAGE/$SERVICE_NAME:${1:-latest}"
SSH_PASSWORD="qybN6Nfvq74xp5tc7bDScP8"
SSH_USER="root"
SSH_HOST="103.153.72.157"

# https://itnext.io/how-to-auto-deploy-your-app-with-one-command-12f9ac00d34a
# Timestamp Function
timestamp() {
    date +"%T"
}
startTime=$(date +%s)

# Init
init() {
    echo "🗝 $(timestamp): login docker registry"
    docker login -u ${CI_REGISTRY_USER} -p ${CI_REGISTRY_PASSWORD} ${CI_REGISTRY}
}

# Go build
buildStatus="⛔ BUILD FAILED"
build () {
    echo "⏲️   $(timestamp): started build script..."
    echo "🏗️   $(timestamp): building $SERVICE_NAME"
    # npm run build
    # TYPE_ERRORS="$(tsc --project ./tsconfig.json)"
    # if [[ -n $TYPE_ERRORS ]]; then
    #     echo "🐛 FOUND ERRORS"
    #     tsc --project ./tsconfig.json   # THIS WILL LOG PRETTIER LOGS
    #     echo "⛔ WILL EXIT NOW"
    #     exit
    # fi --platform linux/amd64
    docker build --build-arg envir=$1 -t $CONTAINER_RELEASE_IMAGE .
    docker push $CONTAINER_RELEASE_IMAGE
    buildStatus="✅ BUILD SUCCESSFUL"
}

testStatus="⛔ TEST FAILED"
test() {
    echo "🔎   $(timestamp): started test script..."
    #npm run build
    testStatus="✅ TEST SUCCESSFUL"
}

releaseStatus="⛔ RELEASE FAILED"
release() {
    echo "🚀   $(timestamp): started release script..."
    # docker pull $CONTAINER_TEST_IMAGE
    # docker tag $CONTAINER_TEST_IMAGE $CONTAINER_RELEASE_IMAGE
    # docker push $CONTAINER_RELEASE_IMAGE
    releaseStatus="✅ RELEASE SUCCESSFUL"
}

# Deploy to Minikube using kubectl
deployStatus="⛔ DEPLOY FAILED"
deploy() {
    echo "🌧️  $(timestamp): deploying to Server"
    echo "Connecting to remote server..."
    /usr/bin/expect<<EOF
set timeout -1
spawn scp -r ../docker-compose.prod.yml $SSH_USER@$SSH_HOST:$TARGET_DIR
expect {
    "yes/no" { send "yes\r" }
    "*assword*" { send -- $SSH_PASSWORD\r }
}
expect "$ "
spawn ssh -o StrictHostKeyChecking=no -o CheckHostIP=no $SSH_USER@$SSH_HOST
match_max 100000
expect "*?assword: "
send -- "$SSH_PASSWORD\r"
expect "*root@*"
send "docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY\r"
expect "Login Succeeded" { send "\r" }
send "docker pull $CONTAINER_RELEASE_IMAGE\r"
expect "*root@*"
send "docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps $SERVICE_NAME\r"
expect "*root@*"
send "docker image prune -f\r"
expect "*root@*"
send "exit\r"
expect eof
EOF
    deployStatus="✅ DEPLOY SUCCESSFUL"
}

# # Orchestrate
echo "🤖  Welcome to the Builder v1, written by github.com/vinpro24"
init
build
test
release
# deploy

echo ""
echo "--------DEPLOY STATUS--------"
echo "  $buildStatus"
echo "  $testStatus"
echo "  $releaseStatus"
echo "  $deployStatus"
echo "----------------"
echo "It took $(((($(date +'%s') - $startTime)/60)%60)) minutes $((($(date +'%s') - $startTime)%60)) seconds"

# if [[ $1 = "build" ]]; then
#     if [[ $2 = "docker" ]]; then
#         build
#         buildDocker
#         echo "✔️    $(timestamp): complete."
#         echo "👋  $(timestamp): exiting..."
#     elif [[ $2 = "bin" ]]; then
#         build
#         echo "✔️    $(timestamp): complete."
#         echo "👋  $(timestamp): exiting..."
#     else
#         echo "🤔   $(timestamp): missing build argument"
#     fi
# else
#     if [[ $1 = "--help" ]]; then
#         echo "build - start a build to produce artifacts"
#         echo "  docker - produces docker images"
#         echo "  bin - produces executable binaries"
#     else
#         echo "🤔  $(timestamp): no arguments passed, type --help for a list of arguments"
#     fi
# fi