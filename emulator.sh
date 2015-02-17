echo "Emulating..."
cd ./platforms/ios/build/emulator
var=$(pwd)

ios-sim launch "$var"/*.app