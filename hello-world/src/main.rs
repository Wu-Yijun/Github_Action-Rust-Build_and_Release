#[cfg(target_os = "windows")]
const PLATFORM: &str = "Windows";
#[cfg(target_os = "windows")]
const LIBRART_PATH: &str = "libs/library_test.dll";

#[cfg(target_os = "linux")]
const PLATFORM: &str = "Linux";
#[cfg(target_os = "linux")]
const LIBRART_PATH: &str = "libs/liblibrary_test.so";

#[cfg(target_os = "macos")]
const PLATFORM: &str = "macOS";
#[cfg(target_os = "macos")]
const LIBRART_PATH: &str = "libs/liblibrary_test.dylib";

const TEST_ERROR_PATH: &str = "libs/libtest_error";

fn main() {
    // std::panic::set_hook(Box::new(|err| {
    //     println!("Panic occurred");
    //     println!("{}", err);
    //     std::process::exit(1);
    // }));

    println!("Hello, world!");
    println!("Running on {}", PLATFORM);
    let lib = unsafe { libloading::Library::new(TEST_ERROR_PATH).unwrap() };
    // let lib = unsafe { libloading::Library::new(LIBRART_PATH).unwrap() };
    let add: libloading::Symbol<fn(usize, usize) -> usize> = unsafe { lib.get(b"add\0").unwrap() };
    println!("Test ffi: 1 + 2 = {}", add(1, 2));

    // If everything is fine, exit with a zero status code
    std::process::exit(0);
}
