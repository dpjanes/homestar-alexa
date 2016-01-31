#
#   Pull.sh
#
#   David Janes
#   IOTDB
#   2016-01-11
#
#   This will pull the latest version of the function down
#   from AWS and place it in src.zip
#

AWS_FUNCTION="HomeStar"
ZIP_URL=`aws lambda get-function --function "${AWS_FUNCTION}" |
python -c 'import sys, json; print json.load(sys.stdin)["Code"]["Location"]'`
if [ -z "${ZIP_URL}" ]
then
    echo "$0: something went wrong"
    exit
fi

DST_DIR="src.pull"
DST_ZIP="pull.zip"

if [ ! -d "${DST_DIR}" ]
then
    mkdir "${DST_DIR}" || exit 1
fi

curl --location "${ZIP_URL}" > "${DST_ZIP}" || exit 1
unzip -o -d "${DST_DIR}" "${DST_ZIP}" || exit 1
rm "${DST_ZIP}"
date > "${DST_DIR}/PULL.txt"
