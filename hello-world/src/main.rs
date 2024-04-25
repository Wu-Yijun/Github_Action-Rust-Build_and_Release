
// mod test_lib_load;
mod test_video;

fn main() {
    println!("Hello, world!");

    // test_lib_load::main();
    test_video::main();

    // If everything is fine, exit with a zero status code
    std::process::exit(0);
}
