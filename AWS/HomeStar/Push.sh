#
#   Push.sh
#
#   David Janes
#   IOTDB
#   2016-01-11
#
#   This will push the latest version of the function to AWS
#

AWS_FUNCTION="HomeStar"

SRC_DIR="src"
DST_DIR="src.push"
DST_ZIP="${PWD}/push.zip"

if [ ! -d "${DST_DIR}" ]
then
    mkdir "${DST_DIR}" || exit 1
fi

( cd "${SRC_DIR}" && tar --exclude "node_modules" -Lc -f - . ) |
( 
    cd "${DST_DIR}" || exit 1
    tar -xvf -  || exit 1
    sed -e "1,\$ s|IOTDB|file://$HOME/iotdb/iot|g" package.json > package.json.tmp && mv package.json.tmp package.json
    npm install || exit 1

    rm -rf node_modues/*/node_modules/*iotdb*
    rm -rf node_modues/*/node_modules/*homestar*

    rm -f "${DST_ZIP}"
    zip -r "${DST_ZIP}" . || exit 1
) || exit 1

aws lambda "update-function-code" --function-name "${AWS_FUNCTION}" --zip-file "fileb://${DST_ZIP}" || exit 1
rm "${DST_ZIP}"
