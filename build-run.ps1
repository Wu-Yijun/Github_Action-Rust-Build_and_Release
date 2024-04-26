cargo build --release

mkdir ./target/release/output/libs
cp ${pwd}/ffmpeg/bin/*.dll ./target/release/output/libs
mv ./target/release/hello-world.exe ./target/release/output
mv ./target/release/*.dll ./target/release/output/libs

./target/release/output/hello-world.exe

# Compresse the output folder
# Compress-Archive -Path ./target/release/output -DestinationPath ./target/release/output.zip