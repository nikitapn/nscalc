#/bin/env bash

set -e

while getopts ":w:h:scd" opt; do
  case $opt in
     w)
       APP_DIR=${OPTARG}
       ;;
     h)
       HOSTNAME=${OPTARG}
       ;;
     s)
       DEPLOY_SERVER=1
       ;;
     c)
       DEPLOY_CLIENT=1
       ;;
     d)
       DEPLOY_DATA=1
       ;;
     *)
       echo "Invalid option: -${OPTARG}."
       exit 1
       ;;
  esac
done

[ -z $APP_DIR ] && echo 'app dir is not specified' && exit 1
[ -z $HOSTNAME ] && echo 'hostname is reuqired' && exit 1

shift $(expr $OPTIND - 1)

[ -z $DEPLOY_SERVER ] && [ -z $DEPLOY_CLIENT ] && [ -z $DEPLOY_DATA ] && echo 'at least one of "-s -c -d" must be specified' && exit 1
[ -z $1 ] && echo '"user@server:/path/to/temp" is not set' && exit 1

TEMP_DIR=$(echo $1 | sed -n 's/.*:\(.*\).*/\1/p')
SERVER=$(echo $1 | sed -n 's/\(.*\):.*/\1/p')

[ -z $SERVER ] || [ -z $TEMP_DIR ] && echo 'incorrect input' && exit 1

if [ "$DEPLOY_CLIENT" ]; then
  scp runtime/nscalc-client.tar.gz $1
  ssh $SERVER "cd $TEMP_DIR && \
    tar -xzf nscalc-client.tar.gz -C $APP_DIR \
  "
fi;

if [ "$DEPLOY_SERVER" ]; then
  scp runtime/nscalc-server.tar.gz $1
  ssh $SERVER "cd $TEMP_DIR &&
    tar -xzf nscalc-server.tar.gz && \
    cd out && \
    docker build -t cpp-runtime-env -f Dockerfile.runtime . && \
    docker rm -f nscalc &> /dev/null &&
    docker run -d --name nscalc \
      -v ${APP_DIR}:/app \
      -w /app \
      -p 8080:8080 \
      cpp-runtime-env \
      nscalc \
        --hostname $HOSTNAME \
        --root-dir www \
        --data-dir data \
        --use_ssl 1 \
        --public_key cert/fullchain.pem \
        --private_key cert/privkey.pem \
        --dh_params cert/ssl-dhparams.pem \
  "
fi;

if [ "$DEPLOY_DATA" ]; then
  scp runtime/nscalc-data.tar.gz $1
  ssh $SERVER "cd $TEMP_DIR && \
    tar -xzf nscalc-data.tar.gz -C $APP_DIR \
  "
fi;