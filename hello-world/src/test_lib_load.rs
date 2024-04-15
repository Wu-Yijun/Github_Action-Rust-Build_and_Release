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

#[allow(dead_code)]
const TEST_ERROR_PATH: &str = "libs/libtest_error";


pub fn main() {
  println!("Running on {}", PLATFORM);
  // let lib = unsafe { libloading::Library::new(TEST_ERROR_PATH).unwrap() };
  let lib = unsafe { libloading::Library::new(LIBRART_PATH).unwrap() };
  let add: libloading::Symbol<fn(usize, usize) -> usize> = unsafe { lib.get(b"add\0").unwrap() };
  println!("Test ffi: 1 + 2 = {}", add(1, 2));
  assert_eq!(999 + 111, add(999, 111));
}
